import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { LucideIcon } from "lucide-react"

interface InfoItem {
    label: string
    value: string | number | null | undefined
    icon?: LucideIcon
}

interface ProfileInfoSectionProps {
    title: string
    items: InfoItem[]
    columns?: 1 | 2
}

export function ProfileInfoSection({ title, items, columns = 2 }: ProfileInfoSectionProps) {
    return (
        <Card className="h-full shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={`grid grid-cols-1 ${columns === 2 ? 'md:grid-cols-2' : ''} gap-y-6 gap-x-8`}>
                    {items.map((item, index) => (
                        <div key={index} className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {item.icon && <item.icon className="h-4 w-4" />}
                                <span>{item.label}</span>
                            </div>
                            <p className="font-medium text-sm">{item.value || '—'}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
