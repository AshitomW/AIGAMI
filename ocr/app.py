import io
import logging

import pdf2image
import pytesseract
from flask import Flask, jsonify, request
from PIL import Image
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "bmp", "tiff", "pdf"}

# Tesseract configuration (adjust path if needed)
# pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract'  # Linux
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'  # Windows


def allowed_file(filename):
    """Check if file extension is allowed"""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def extract_text_from_image(image):
    """Extract text from PIL Image using Tesseract"""
    try:
        # Configure Tesseract options for better accuracy
        config = r"--oem 3 --psm 6"
        text = pytesseract.image_to_string(image, config=config)
        return text.strip()
    except Exception as e:
        logger.error(f"Error extracting text from image: {str(e)}")
        raise


def extract_text_from_pdf(pdf_file):
    """Extract text from PDF by converting to images first"""
    try:
        # Convert PDF to images
        images = pdf2image.convert_from_bytes(pdf_file.read())

        extracted_text = []
        for i, image in enumerate(images):
            logger.info(f"Processing page {i + 1}/{len(images)}")
            text = extract_text_from_image(image)
            if text:
                extracted_text.append(f"--- Page {i + 1} ---\n{text}")

        return "\n\n".join(extracted_text)
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        raise


@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "OCR API is running"})


@app.route("/extract-text", methods=["POST"])
def extract_text():
    """Main endpoint to extract text from uploaded files"""
    try:
        # Check if file is present in request
        if "file" not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files["file"]

        # Check if file is selected
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        # Check if file type is allowed
        if not allowed_file(file.filename):
            return jsonify(
                {
                    "error": "File type not supported",
                    "supported_types": list(ALLOWED_EXTENSIONS),
                }
            ), 400

        filename = secure_filename(file.filename)
        file_extension = filename.rsplit(".", 1)[1].lower()

        logger.info(f"Processing file: {filename}")

        # Process based on file type
        if file_extension == "pdf":
            text = extract_text_from_pdf(file)
        else:
            # Handle image files
            image = Image.open(file.stream)
            # Convert to RGB if necessary
            if image.mode != "RGB":
                image = image.convert("RGB")
            text = extract_text_from_image(image)

        # Get additional options from request
        include_confidence = (
            request.form.get("include_confidence", "false").lower() == "true"
        )

        response_data = {
            "filename": filename,
            "text": text,
            "character_count": len(text),
            "word_count": len(text.split()) if text else 0,
        }

        # Add confidence scores if requested
        if include_confidence and file_extension != "pdf":
            try:
                file.stream.seek(0)  # Reset file pointer
                image = Image.open(file.stream)
                if image.mode != "RGB":
                    image = image.convert("RGB")

                # Get confidence data
                data = pytesseract.image_to_data(
                    image, output_type=pytesseract.Output.DICT
                )
                confidences = [int(conf) for conf in data["conf"] if int(conf) > 0]

                if confidences:
                    response_data["confidence"] = {
                        "mean": sum(confidences) / len(confidences),
                        "min": min(confidences),
                        "max": max(confidences),
                    }
            except Exception as e:
                logger.warning(f"Could not calculate confidence: {str(e)}")

        logger.info(f"Successfully processed {filename}")
        return jsonify(response_data)

    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        return jsonify({"error": f"Processing failed: {str(e)}"}), 500


@app.route("/extract-text-url", methods=["POST"])
def extract_text_from_url():
    """Extract text from image URL"""
    try:
        data = request.get_json()
        if not data or "url" not in data:
            return jsonify({"error": "URL is required"}), 400

        url = data["url"]

        # Download and process image from URL
        import requests

        response = requests.get(url, timeout=30)
        response.raise_for_status()

        # Open image from response content
        image = Image.open(io.BytesIO(response.content))
        if image.mode != "RGB":
            image = image.convert("RGB")

        text = extract_text_from_image(image)

        return jsonify(
            {
                "url": url,
                "text": text,
                "character_count": len(text),
                "word_count": len(text.split()) if text else 0,
            }
        )

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to download image: {str(e)}"}), 400
    except Exception as e:
        logger.error(f"Error processing URL: {str(e)}")
        return jsonify({"error": f"Processing failed: {str(e)}"}), 500


@app.route("/supported-formats", methods=["GET"])
def supported_formats():
    """Get list of supported file formats"""
    return jsonify(
        {"supported_formats": list(ALLOWED_EXTENSIONS), "max_file_size": "16MB"}
    )


@app.errorhandler(413)
def too_large(e):
    """Handle file too large error"""
    return jsonify({"error": "File too large. Maximum size is 16MB"}), 413


@app.errorhandler(500)
def internal_error(e):
    """Handle internal server errors"""
    return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    # Check if Tesseract is installed
    try:
        pytesseract.get_tesseract_version()
        logger.info("Tesseract OCR is available")
    except Exception as e:
        logger.error(f"Tesseract OCR not found: {str(e)}")
        logger.error("Please install Tesseract OCR and ensure it's in your PATH")

    app.run(debug=True, host="0.0.0.0", port=8900)
