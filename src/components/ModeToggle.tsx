"use client"
import * as React from "react"
import { Moon, MoonIcon, Sun } from "lucide-react"
import { useTheme } from "next-themes"


export function ModeToggle() {
  const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => setMounted(true),[])
    
    if (!mounted) return null;



  return (
<div  className="border border-zinc-300 rounded-md h-8 w-8 place-content-center" >
    { theme === "light" ? 
        <Sun
        className="h-5 w-5 dark:scale-0 text-zinc-400 m-auto"
        onClick={() => setTheme('dark')}
        />
        :
        <Moon
            className="h-5 w-5 scale-0 dark:scale-100 text-zinc-400 m-auto"
            onClick={() => setTheme('light')}
        />
    }
</div>


 
  )
}
