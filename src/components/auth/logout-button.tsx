'use client'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Loader2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { VariantProps } from 'class-variance-authority'

type ButtonProps = React.ComponentProps<"button"> & 
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

interface LogoutButtonProps extends Omit<ButtonProps, 'onClick'> {
  showIcon?: boolean
}

export function LogoutButton({
  variant = 'ghost',
  showIcon = true,
  children,
  ...props
}: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    
    try {
      await supabase.auth.signOut()
      router.refresh()
      router.push('/login')
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      onClick={handleLogout}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {showIcon && <LogOut className="h-4 w-4 mr-2" />}
          {children || 'Keluar'}
        </>
      )}
    </Button>
  )
}
