// src/app/(pages)/profile/page.tsx
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        title="My Profile"
        description="Manage your account details."
      />
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Profile management is coming soon.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
