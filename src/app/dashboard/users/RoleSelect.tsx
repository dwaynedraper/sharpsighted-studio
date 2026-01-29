'use client'

import { useState } from 'react'

interface RoleSelectProps {
    userId: string
    currentRole: string
    userEmail: string
}

export function RoleSelect({ userId, currentRole, userEmail }: RoleSelectProps) {
    const [role, setRole] = useState(currentRole)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleChange(newRole: string) {
        if (newRole === role) return

        if (!confirm(`Change role for ${userEmail} to ${newRole}?`)) {
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const res = await fetch('/api/admin/users/set-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to update role')
            }

            setRole(newRole)
            window.location.reload()
        } catch (e: any) {
            setError(e.message)
            alert(`Error: ${e.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <select
            value={role}
            onChange={(e) => handleChange(e.target.value)}
            disabled={isLoading}
            style={{
                padding: '4px 8px',
                fontSize: 14,
                border: '1px solid rgba(0,0,0,0.2)',
                borderRadius: 4,
                backgroundColor: 'white',
                cursor: isLoading ? 'wait' : 'pointer',
            }}
        >
            <option value="user">user</option>
            <option value="admin">admin</option>
            <option value="superAdmin">superAdmin</option>
        </select>
    )
}
