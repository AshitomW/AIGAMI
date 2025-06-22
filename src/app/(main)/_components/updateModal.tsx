"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  Eye,
  EyeOff,
  Loader2,
  Upload,
  X,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import {
  updatePasswordAction,
  uploadAvatarAction,
  deleteAvatarAction,
} from "@/lib/actions/profile";
import { useSession } from "@/providers/sessionprovider";

interface ProfileUpdateModalProps {
  currentAvatarUrl?: string;
  userEmail?: string;
}

export default function ProfileUpdateModal({
  currentAvatarUrl,
  userEmail,
}: ProfileUpdateModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const isPasswordStrong =
    passwordForm.newPassword.length >= 8 &&
    /[A-Z]/.test(passwordForm.newPassword) &&
    /[a-z]/.test(passwordForm.newPassword) &&
    /[0-9]/.test(passwordForm.newPassword);

  const passwordsMatch =
    passwordForm.newPassword === passwordForm.confirmPassword &&
    passwordForm.confirmPassword !== "";

  const isPasswordFormValid =
    passwordForm.currentPassword &&
    passwordForm.newPassword &&
    passwordForm.confirmPassword &&
    isPasswordStrong &&
    passwordsMatch;

  const session = useSession();
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload a JPEG, PNG, GIF, or WebP image.",
      });
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please upload an image smaller than 1MB.",
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordFormValid) return;

    setLoading(true);
    try {
      const result = await updatePasswordAction(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      if (result.errorMessage) {
        toast.error("Password Update Failed", {
          description: result.errorMessage,
        });
      } else {
        toast.success("Password Updated", {
          description: "Your password has been successfully updated",
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setOpen(false);
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const result = await uploadAvatarAction(formData);

      if (result.errorMessage) {
        toast.error("Avatar Upload Failed", {
          description: result.errorMessage,
        });
      } else {
        toast.success("Avatar Updated", {
          description: "Your avatar has been successfully updated",
        });
        setOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null);

        session.refreshUser();
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    setLoading(true);
    try {
      const result = await deleteAvatarAction();

      if (result.errorMessage) {
        toast.error("Avatar Delete Failed", {
          description: result.errorMessage,
        });
      } else {
        toast.success("Avatar Removed", {
          description: "Your avatar has been successfully removed",
        });
        setOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null);

        window.location.reload();
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 bg-white border-gray-200 hover:bg-gray-50"
        >
          <Settings className="w-4 h-4 mr-2" />
          Update Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="avatar" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="avatar">Avatar</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          <TabsContent value="avatar" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Current Avatar</Label>
                <div className="flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-2 ring-gray-200 bg-gray-100">
                    <img
                      src={
                        previewUrl ||
                        session.user?.avatarUrl! ||
                        "https://pplx-res.cloudinary.com/image/upload/v1750508474/gpt4o_images/u9mge1he70nliekq4que.png"
                      }
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Upload New Avatar</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                  {selectedFile && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearSelection}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {selectedFile && (
                  <p className="text-xs text-gray-500">
                    Selected: {selectedFile.name} (
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Supports JPEG, PNG, GIF, WebP. Max size: 5MB
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAvatarUpload}
                  disabled={loading || !selectedFile}
                  className="flex-1"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Upload Avatar
                </Button>
                {currentAvatarUrl && (
                  <Button
                    onClick={handleDeleteAvatar}
                    disabled={loading}
                    variant="destructive"
                    size="sm"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="password" className="space-y-4">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="focus:ring-0 focus:border-black pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="focus:ring-0 focus:border-black pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordForm.newPassword && (
                  <div className="text-xs space-y-1">
                    <div
                      className={`flex items-center gap-2 ${
                        isPasswordStrong ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      <span>{isPasswordStrong ? "✓" : "✗"}</span>
                      <span>
                        Strong password (8+ chars, uppercase, lowercase, number)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="focus:ring-0 focus:border-black pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordForm.confirmPassword && (
                  <div className="text-xs">
                    <div
                      className={`flex items-center gap-2 ${
                        passwordsMatch ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      <span>{passwordsMatch ? "✓" : "✗"}</span>
                      <span>Passwords match</span>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !isPasswordFormValid}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Update Password
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
