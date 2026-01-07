import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Mail, MapPin, Phone } from "lucide-react"

interface ProfileHeaderProps {
    user: {
        name: string
        role: string
        email: string
        phone?: string
        location?: string
        avatar?: string
        coverImage?: string
    }
    onEdit?: () => void
}

export function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
    return (
        <Card className="mb-6 overflow-hidden border-none shadow-md">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                {/* Cover Image Placeholder */}
                {user.coverImage && (
                    <img
                        src={user.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-50"
                    />
                )}
                {onEdit && (
                    <Button
                        variant="secondary"
                        size="sm"
                        className="absolute top-4 right-4 opacity-90 hover:opacity-100"
                        onClick={onEdit}
                    >
                        <Camera className="mr-2 h-4 w-4" />
                        Edit Cover
                    </Button>
                )}
            </div>
            <CardContent className="relative pt-0 pb-6 px-6">
                <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-4 gap-4">
                    <div className="relative">
                        <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-xl bg-blue-100 text-blue-700">
                                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        {onEdit && (
                            <Button
                                size="icon"
                                variant="secondary"
                                className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md"
                                onClick={onEdit}
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    <div className="flex-1 pt-2 md:pt-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                        {user.role.replace(/_/g, ' ')}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <MapPin className="h-3 w-3" /> {user.location || 'Location not set'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {onEdit && (
                                    <Button onClick={onEdit}>
                                        Edit Profile
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 border-t pt-4">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                            <Mail className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-muted-foreground text-xs">Email Address</p>
                            <p className="font-medium">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="p-2 bg-green-50 rounded-full text-green-600">
                            <Phone className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-muted-foreground text-xs">Phone Number</p>
                            <p className="font-medium">{user.phone || 'Not provided'}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
