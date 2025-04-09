import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Briefcase, Calendar, LinkIcon } from "lucide-react"
import Link from "next/link"

interface ProfileAboutProps {
  username: string
}

export function ProfileAbout({ username }: ProfileAboutProps) {
  // In a real app, fetch this data based on username
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Bio</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          Digital creator and photography enthusiast. Sharing moments from around the world. ✈️ 🌍 📸
          <br />
          <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span>Photographer at Studio Creative</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Joined January 2021</span>
          </div>
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
            <Link href="https://alexjohnson.com" target="_blank" className="text-primary hover:underline">
              alexjohnson.com
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
