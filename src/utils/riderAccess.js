import { supabase } from '@/utils/supabase'

const BLOCKED_ACCOUNT_STATUSES = new Set([
  'blocked',
  'banned',
  'deactivated',
  'disabled',
  'inactive',
  'rejected',
  'suspended',
])

const BLOCKED_APPLICATION_STATUSES = new Set([
  'blocked',
  'banned',
  'deactivated',
  'disabled',
  'inactive',
  'rejected',
  'suspended',
])

const createUnlockedAccessState = () => ({
  blocked: false,
  reason: '',
  status: '',
  title: '',
  message: '',
})

const normalizeAccessValue = (value) => (
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
)

const isTruthyFlag = (value) => {
  if (value === true || value === 1) return true

  const normalizedValue = normalizeAccessValue(value)
  return normalizedValue === 'true' || normalizedValue === '1'
}

const isFalseFlag = (value) => {
  if (value === false || value === 0) return true

  const normalizedValue = normalizeAccessValue(value)
  return normalizedValue === 'false' || normalizedValue === '0'
}

const buildBlockedAccessState = ({ reason, status, title, message }) => ({
  blocked: true,
  reason,
  status,
  title,
  message,
})

const isMissingAuthSessionError = (error) => {
  const errorName = String(error?.name || '')
  const errorMessage = String(error?.message || '')

  return (
    errorName === 'AuthSessionMissingError' ||
    /auth session missing/i.test(errorMessage)
  )
}

export const getSafeInternalPath = (targetPath, fallback = '/application-form') => {
  const normalizedTarget = Array.isArray(targetPath) ? targetPath[0] : targetPath

  if (
    typeof normalizedTarget === 'string' &&
    normalizedTarget.startsWith('/') &&
    !normalizedTarget.startsWith('//')
  ) {
    return normalizedTarget
  }

  return fallback
}

export const hasActiveRiderApplication = (application) => (
  Boolean(application && application.status !== 'rejected')
)

export const hasExistingRiderApplication = (application) => Boolean(application)

export const getCurrentAuthUser = async () => {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError && !isMissingAuthSessionError(sessionError)) {
    throw sessionError
  }

  if (!session?.user) {
    return null
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error && isMissingAuthSessionError(error)) {
    return null
  }

  if (error) {
    throw error
  }

  return user || session.user || null
}

export const getRiderProfile = async (profileId) => {
  if (!profileId) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    throw error
  }

  return data || null
}

export const getLatestRiderApplication = async (profileId) => {
  if (!profileId) return null

  const { data, error } = await supabase
    .from('Rider_Registration')
    .select('*')
    .eq('profile_id', profileId)
    .order('application_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    throw error
  }

  return data || null
}

const getProfileAccessState = (profile) => {
  if (!profile) return null

  const statusKeys = ['account_status', 'status', 'rider_status', 'approval_status']

  for (const key of statusKeys) {
    const normalizedStatus = normalizeAccessValue(profile[key])

    if (BLOCKED_ACCOUNT_STATUSES.has(normalizedStatus)) {
      return buildBlockedAccessState({
        reason: 'profile_deactivated',
        status: normalizedStatus,
        title: 'Rider access has been disabled',
        message: 'Your rider account has been deactivated by an administrator. New rider applications are unavailable for this account. Please contact support if you need assistance.',
      })
    }
  }

  const falseFlags = ['is_active', 'active']

  for (const key of falseFlags) {
    if (key in profile && isFalseFlag(profile[key])) {
      return buildBlockedAccessState({
        reason: 'profile_deactivated',
        status: 'inactive',
        title: 'Rider access has been disabled',
        message: 'Your rider account has been deactivated by an administrator. New rider applications are unavailable for this account. Please contact support if you need assistance.',
      })
    }
  }

  const trueFlags = [
    'is_banned',
    'banned',
    'is_blocked',
    'blocked',
    'is_deactivated',
    'deactivated',
    'is_disabled',
    'disabled',
    'is_suspended',
    'suspended',
  ]

  for (const key of trueFlags) {
    if (key in profile && isTruthyFlag(profile[key])) {
      return buildBlockedAccessState({
        reason: 'profile_deactivated',
        status: normalizeAccessValue(key.replace(/^is_/, '')),
        title: 'Rider access has been disabled',
        message: 'Your rider account has been deactivated by an administrator. New rider applications are unavailable for this account. Please contact support if you need assistance.',
      })
    }
  }

  return null
}

const getApplicationAccessState = (application) => {
  if (!application) return null

  const normalizedStatus = normalizeAccessValue(application.status)

  if (normalizedStatus === 'rejected') {
    const rejectionReason = application.rejection_reason
      ? ` Admin note: ${application.rejection_reason}`
      : ''

    return buildBlockedAccessState({
      reason: 'application_rejected',
      status: normalizedStatus,
      title: 'New rider applications are disabled',
      message: `Your rider application was rejected by the admin team. You cannot submit a new rider application from this account right now.${rejectionReason} Please contact support if you need clarification.`,
    })
  }

  if (BLOCKED_APPLICATION_STATUSES.has(normalizedStatus)) {
    return buildBlockedAccessState({
      reason: 'application_deactivated',
      status: normalizedStatus,
      title: 'Rider application access has been disabled',
      message: 'Your rider application has been deactivated by an administrator. New rider applications are unavailable for this account. Please contact support if you need assistance.',
    })
  }

  return null
}

export const getRiderAccessState = ({ profile = null, application = null } = {}) => (
  getProfileAccessState(profile) ||
  getApplicationAccessState(application) ||
  createUnlockedAccessState()
)

export const getRiderRouteContext = async (profileId) => {
  const [profile, latestApplication] = await Promise.all([
    getRiderProfile(profileId),
    getLatestRiderApplication(profileId),
  ])

  return {
    profile,
    latestApplication,
    accessState: getRiderAccessState({
      profile,
      application: latestApplication,
    }),
  }
}

export const getOwnedRiderApplicationById = async (profileId, applicationId) => {
  if (!profileId || !applicationId) return null

  const { data, error } = await supabase
    .from('Rider_Registration')
    .select('*')
    .eq('profile_id', profileId)
    .eq('rider_id', applicationId)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    throw error
  }

  return data || null
}
