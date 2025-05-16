import { Card, CardContent } from "@/components/ui/card"
import { Shield, FileCheck, CheckCircle, Activity } from "lucide-react"

export function StatsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="p-2 rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">1,245</h3>
            <p className="text-sm text-muted-foreground">Agents Verified</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="p-2 rounded-full bg-primary/10">
              <FileCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">3,872</h3>
            <p className="text-sm text-muted-foreground">Credentials Issued</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="p-2 rounded-full bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">512</h3>
            <p className="text-sm text-muted-foreground">Audits Completed</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="p-2 rounded-full bg-primary/10">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">98.7%</h3>
            <p className="text-sm text-muted-foreground">Trust Accuracy</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
