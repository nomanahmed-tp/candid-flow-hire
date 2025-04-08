
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Bell, Shield, Globe, Moon, Sun, Key } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();

  // Mock settings state
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    newCandidate: true,
    interviewReminders: true,
    feedbackRequests: true,
  });

  const [appearance, setAppearance] = useState({
    theme: "light",
    compactView: false,
    animations: true,
  });

  const [privacy, setPrivacy] = useState({
    showProfileToTeam: true,
    shareCalendar: true,
    showFeedbackAuthorship: true,
  });

  const saveSetting = (type: string) => {
    toast({
      title: "Settings saved",
      description: `Your ${type} settings have been updated.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Delivery Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={(checked) => {
                        setNotifications({ ...notifications, email: checked });
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="browser-notifications">Browser Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Show desktop notifications in your browser
                      </p>
                    </div>
                    <Switch
                      id="browser-notifications"
                      checked={notifications.browser}
                      onCheckedChange={(checked) => {
                        setNotifications({ ...notifications, browser: checked });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="new-candidate">New Candidate Applications</Label>
                      <p className="text-sm text-muted-foreground">
                        When a new candidate applies for a job
                      </p>
                    </div>
                    <Switch
                      id="new-candidate"
                      checked={notifications.newCandidate}
                      onCheckedChange={(checked) => {
                        setNotifications({ ...notifications, newCandidate: checked });
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="interview-reminders">Interview Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive reminders about upcoming interviews
                      </p>
                    </div>
                    <Switch
                      id="interview-reminders"
                      checked={notifications.interviewReminders}
                      onCheckedChange={(checked) => {
                        setNotifications({ ...notifications, interviewReminders: checked });
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="feedback-requests">Feedback Requests</Label>
                      <p className="text-sm text-muted-foreground">
                        When someone requests feedback from you
                      </p>
                    </div>
                    <Switch
                      id="feedback-requests"
                      checked={notifications.feedbackRequests}
                      onCheckedChange={(checked) => {
                        setNotifications({ ...notifications, feedbackRequests: checked });
                      }}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={() => saveSetting('notification')}>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how the application looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Theme</h3>
                <div className="flex gap-4">
                  <Button
                    variant={appearance.theme === "light" ? "default" : "outline"}
                    className="flex items-center gap-2 w-32"
                    onClick={() => setAppearance({ ...appearance, theme: "light" })}
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={appearance.theme === "dark" ? "default" : "outline"}
                    className="flex items-center gap-2 w-32"
                    onClick={() => setAppearance({ ...appearance, theme: "dark" })}
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant={appearance.theme === "system" ? "default" : "outline"}
                    className="flex items-center gap-2 w-32"
                    onClick={() => setAppearance({ ...appearance, theme: "system" })}
                  >
                    <Globe className="h-4 w-4" />
                    System
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Display Options</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compact-view">Compact View</Label>
                      <p className="text-sm text-muted-foreground">
                        Use a more compact layout for tables and lists
                      </p>
                    </div>
                    <Switch
                      id="compact-view"
                      checked={appearance.compactView}
                      onCheckedChange={(checked) => {
                        setAppearance({ ...appearance, compactView: checked });
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="animations">Animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable or disable UI animations
                      </p>
                    </div>
                    <Switch
                      id="animations"
                      checked={appearance.animations}
                      onCheckedChange={(checked) => {
                        setAppearance({ ...appearance, animations: checked });
                      }}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={() => saveSetting('appearance')}>Save Appearance Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control your visibility and data sharing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-profile">Profile Visibility</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow team members to view your profile
                    </p>
                  </div>
                  <Switch
                    id="show-profile"
                    checked={privacy.showProfileToTeam}
                    onCheckedChange={(checked) => {
                      setPrivacy({ ...privacy, showProfileToTeam: checked });
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="share-calendar">Calendar Sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Share your calendar availability for interview scheduling
                    </p>
                  </div>
                  <Switch
                    id="share-calendar"
                    checked={privacy.shareCalendar}
                    onCheckedChange={(checked) => {
                      setPrivacy({ ...privacy, shareCalendar: checked });
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="feedback-authorship">Feedback Authorship</Label>
                    <p className="text-sm text-muted-foreground">
                      Show your name on feedback you provide
                    </p>
                  </div>
                  <Switch
                    id="feedback-authorship"
                    checked={privacy.showFeedbackAuthorship}
                    onCheckedChange={(checked) => {
                      setPrivacy({ ...privacy, showFeedbackAuthorship: checked });
                    }}
                  />
                </div>
              </div>

              <Button onClick={() => saveSetting('privacy')}>Save Privacy Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account security and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password</h3>
                <Button variant="outline">Change Password</Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Two Factor Authentication</h3>
                <Button variant="outline">Set Up 2FA</Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Actions</h3>
                <div className="flex gap-4">
                  <Button variant="outline">Export My Data</Button>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
