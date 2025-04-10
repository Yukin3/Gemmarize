import { Link } from "react-router-dom";
import { IconZodiacGemini } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useEffect } from "react";
import ProfileMenu from "@/components/profile-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthStore } from "@/hooks/useAuthStore"
import { useState } from "react"
import { Menu, X } from "lucide-react" 


export interface User {
    id: string
    name: string
    email: string
    profile_picture: string
    role?: "user" | "admin" | "dev" | "moderator"
    roles?: string[] // <-- for multiple role support
    username?: string // optional but used in Avatar and ProfileMenu
    created_at?: string
    updated_at?: string
  }
  
  

export default function Navbar() {
    // const { user, refreshUser } = useAuthStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const user = useAuthStore((state) => state.user);


    const displayAvatar =
    user?.profile_picture ||
    "https://api.dicebear.com/9.x/initials/svg?seed=QariAi?svg?backgroundColor=ffd5dc";
    const userRole = user?.role || user?.roles?.[0] || "Guest"

    const showDashboard = ["admin", "dev", "moderator"].some((r) =>
        [user?.role, ...(user?.roles || [])].includes(r)
      )
      


    return (
        <header className="border-b backdrop-blur-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                
                {/* Logo + title */}
                <div className="flex items-center gap-2">
                    <IconZodiacGemini className="h-8 w-8 text-primary" />
                    <Link to="/" 
                          className="text-2xl font-bold"
                    >
                        Gemmarize
                    </Link>
                </div>

                {/* Nav links (mobile: hidden) */}
                <nav className="hidden md:flex gap-6 items-center">
                {showDashboard && (
                    <Link to="/dashboard" className="font-medium hover:text-primary">Dashboard</Link>
                )}
                <Link to="/upload" className="font-medium hover:text-primary">Upload</Link>

                <Popover>
                    <PopoverTrigger asChild>
                    <Button variant="ghost" className="font-medium">Explore</Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="flex flex-col space-y-2 w-48">
                    <Link to="/papers">
                        <Button variant="ghost" className="w-full justify-start">Papers</Button>
                    </Link>
                    <Link to="/flashcards">
                        <Button variant="ghost" className="w-full justify-start">Flashcards</Button>
                    </Link>
                    <Link to="/summaries">
                        <Button variant="ghost" className="w-full justify-start">Summaries</Button>
                    </Link>
                    <Link to="/quizzes">
                        <Button variant="ghost" className="w-full justify-start">Quizzes</Button>
                    </Link>
                    </PopoverContent>
                </Popover>
                </nav>

                    {/* Mobile Hamburger */}
                    <div className="md:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                    </div>

                {/* R: Display toggle & Auth/User */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    {user ? (
                    <Popover>
                        <PopoverTrigger asChild>
                        <Avatar className="h-10 w-10 cursor-pointer hover:scale-105 transition-transform">
                            <AvatarImage src={user.profile_picture} alt={user.name} />
                            <AvatarFallback>{user.name?.charAt(0) || "G"}</AvatarFallback>
                        </Avatar>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 mt-2 shadow-lg">
                        <ProfileMenu
                            name={user.name}
                            role={userRole}
                            avatar={displayAvatar}
                        />
                        </PopoverContent>
                    </Popover>
                    ) : (
                        <>
                        <Link to="/login">
                            <Button variant="outline">Login</Button>
                        </Link> 
                        <Link to="/signup">
                            <Button>Sign In</Button>
                        </Link>
                        {/* <Button
                        // variant="ghost"
                        onClick={() =>
                            useAuthStore.getState().setUser({
                            id: "guest-001",
                            name: "Guest User",
                            email: "guest@cyberwatch.local",
                            profile_picture: "https://api.dicebear.com/7.x/initials/svg?seed=Guest",
                            role: "user",
                            username: "guest",
                            })
                        }
                        >
                        Continue as Guest
                        </Button> */}
                        </>
                    )}
                </div>
            </div>
            {isMenuOpen && (
            <div className="md:hidden px-4 pb-4">
                <nav className="flex flex-wrap gap-2 justify-center">
                {showDashboard && (
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm">Dashboard</Button>
                    </Link>
                )}
                <Link to="/upload" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm">Upload</Button>
                </Link>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button variant="ghost" className="font-medium">Explore</Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="flex flex-col space-y-2 w-48">
                    <Link to="/papers">
                        <Button variant="ghost" className="w-full justify-start">Papers</Button>
                    </Link>
                    <Link to="/flashcards">
                        <Button variant="ghost" className="w-full justify-start">Flashcards</Button>
                    </Link>
                    <Link to="/summaries">
                        <Button variant="ghost" className="w-full justify-start">Summaries</Button>
                    </Link>
                    <Link to="/quizzes">
                        <Button variant="ghost" className="w-full justify-start">Quizzes</Button>
                    </Link>
                    </PopoverContent>
                </Popover>
                </nav>
            </div>
            )}
        </header>
    );
}
