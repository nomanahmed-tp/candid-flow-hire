
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Pencil, Save, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Hiring Manager",
    phone: "+1 (555) 123-4567",
    department: "Engineering",
    bio: "Experienced hiring manager with a focus on recruiting top engineering talent.",
    imageUrl: "/placeholder.svg"
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <Button
          onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
          className="flex items-center"
        >
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>
              This will be displayed on your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src={userData.imageUrl} />
              <AvatarFallback>
                <User className="h-16 w-16" />
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button variant="outline" className="mt-2">
                Change Photo
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Job Title</Label>
                <Input
                  id="role"
                  value={userData.role}
                  onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={userData.department}
                  onChange={(e) => setUserData({ ...userData, department: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={userData.bio}
                onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                disabled={!isEditing}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
