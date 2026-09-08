import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Workspace preferences for this demo." />
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Workspace</CardTitle>
            <CardDescription>Not editable in this demo — sample data only.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="workspace-name">Workspace name</Label>
              <Input id="workspace-name" defaultValue="Acme Inc" disabled />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="workspace-currency">Billing currency</Label>
              <Input id="workspace-currency" defaultValue="EUR" disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Static preview — not wired up in this demo.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Draft submitted by a creator</p>
                <p className="text-sm text-muted-foreground">Email when a creator submits a post for review.</p>
              </div>
              <Switch defaultChecked disabled />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Weekly attribution summary</p>
                <p className="text-sm text-muted-foreground">A digest of pipeline attributed to your campaigns.</p>
              </div>
              <Switch defaultChecked disabled />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
