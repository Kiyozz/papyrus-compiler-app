/*
 * 2026 Kiyozz.
 */

import { createFileRoute } from '@tanstack/react-router'
import { GroupsPage } from '../pages/groups/groups-page'

export const Route = createFileRoute('/groups')({ component: GroupsPage })
