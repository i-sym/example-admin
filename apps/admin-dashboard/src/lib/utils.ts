import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatTimestamp(date: Date | string): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ${hours % 24}h`
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}

export function formatCapacity(value: number): string {
  return `${value.toFixed(1)} MW`
}

export function formatPower(value: number): string {
  return `${value.toFixed(2)} MW`
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

export function formatCoordinate(value: number): string {
  return value.toFixed(6)
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'online':
    case 'active':
    case 'healthy':
    case 'up':
    case 'connected':
    case 'ok':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'offline':
    case 'inactive':
    case 'unhealthy':
    case 'down':
    case 'disconnected':
    case 'error':
    case 'control-error':
    case 'measurement-error':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'degraded':
    case 'maintenance':
    case 'warning':
    case 'unknown':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function calculateEfficiency(activePower: number, ratedCapacity: number): number {
  if (ratedCapacity === 0) return 0
  return Math.min(activePower / ratedCapacity, 1)
}

export function validateSetpoint(
  setpoint: number,
  minAllowed: number,
  maxAllowed: number
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (setpoint < minAllowed) {
    errors.push(`Setpoint ${setpoint} MW is below minimum allowed ${minAllowed} MW`)
  }

  if (setpoint > maxAllowed) {
    errors.push(`Setpoint ${setpoint} MW exceeds maximum allowed ${maxAllowed} MW`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function generateDeviceId(type: 'rtu' | 'logger', index: number): string {
  const prefix = type === 'rtu' ? 'RTU' : 'LOGGER'
  return `${prefix}_${index.toString().padStart(3, '0')}`
}

export function parseDeviceId(deviceId: string): { type: 'rtu' | 'logger' | null; index: number | null } {
  const match = deviceId.match(/^(RTU|LOGGER)_(\d+)$/)
  if (!match) {
    return { type: null, index: null }
  }

  return {
    type: match[1] === 'RTU' ? 'rtu' : 'logger',
    index: parseInt(match[2], 10),
  }
}


export function sortDevicesByHierarchy(devices: Array<{ id: string; type: string; parentDeviceId?: string | null }>): typeof devices {
  // First, separate RTUs and Loggers
  const rtus = devices.filter(d => d.type === 'rtu').sort((a, b) => a.id.localeCompare(b.id))
  const loggers = devices.filter(d => d.type === 'logger').sort((a, b) => a.id.localeCompare(b.id))

  // Sort loggers by parent RTU, then by ID
  const sortedLoggers = loggers.sort((a, b) => {
    if (a.parentDeviceId !== b.parentDeviceId) {
      return (a.parentDeviceId || '').localeCompare(b.parentDeviceId || '')
    }
    return a.id.localeCompare(b.id)
  })

  return [...rtus, ...sortedLoggers]
}

export function groupDevicesByParent(devices: Array<{ id: string; type: string; parentDeviceId?: string | null }>) {
  const groups: Record<string, typeof devices> = {}

  devices.forEach(device => {
    const parentId = device.parentDeviceId || 'root'
    if (!groups[parentId]) {
      groups[parentId] = []
    }
    groups[parentId].push(device)
  })

  return groups
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastCall = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()

    if (now - lastCall >= wait) {
      lastCall = now
      func(...args)
    }
  }
}
