<script setup lang="ts">
import type { IUserWithRoles } from '@/dto/identity/IUserWithRoles';
import type { IUserFilters } from '@/dto/input/IUserFilters';
import { UserManagementService } from '@/services/admin/UserManagementService';
import { useIdentityStore } from '@/stores/identityStore';
import { onMounted, ref, type StyleValue } from 'vue';

interface ISelectedRole {
    name: string,
    selected: boolean,
}

interface IUserWithSelectedRoles {
    id: string,
    userName: string,
    isApproved: boolean,
    roles: ISelectedRole[],
}

const identityStore = useIdentityStore();

const users = ref(null as IUserWithSelectedRoles[] | null);
const roles = ref(null as string[] | null);
const userManagementService = new UserManagementService();
const filters = ref({ includeOnlyNotApproved: false, nameQuery: null } as IUserFilters);
const selectedUser = ref(null as IUserWithSelectedRoles | null);

const isUserInRole = (user: IUserWithRoles, roleName: string) => {
    return user.roles.some(r => r.name.toUpperCase() === roleName.toUpperCase());
}

const getSelectedRoles = (user: IUserWithRoles, roleNames: string[]): ISelectedRole[] => {
    const result = [] as ISelectedRole[];
    for (const roleName of roleNames) {
        result.push({ name: roleName, selected: isUserInRole(user, roleName) });
    }
    return result;
}

onMounted(async () => {
    const fetchedUsers = await userManagementService.listAll(filters.value);
    await refresh();
});

const refresh = async (event: MouseEvent | Event | null = null) => {
    event?.preventDefault();
    const fetchedUsers = await userManagementService.listAll(filters.value);
    roles.value = await userManagementService.listAllRoleNames();
    users.value = [];
    for (const fetchedUser of fetchedUsers) {
        users.value.push({
            id: fetchedUser.id,
            userName: fetchedUser.userName,
            isApproved: fetchedUser.isApproved,
            roles: getSelectedRoles(fetchedUser, roles.value),
        } as IUserWithSelectedRoles);
    }
}

const approveUser = async (event: MouseEvent | Event, user: IUserWithSelectedRoles) => {
    event.preventDefault();
    await userManagementService.approveRegistration(user.id);
    user.isApproved = true;
    if (filters.value.includeOnlyNotApproved && users.value) {
        const index = users.value.indexOf(user);
        if (index != -1) {
            users.value.splice(index, 1);
        }
    }
}

const toggleRoleMenu = (user: IUserWithSelectedRoles) => {
    if (selectedUser.value == user) {
        selectedUser.value = null;
    } else {
        selectedUser.value = user;
    }
}

const updateRole = async (user: IUserWithSelectedRoles, role: ISelectedRole) => {
    role.selected = !role.selected;
    try {
        if (role.selected) {
            await userManagementService.addToRole(user.id, role.name);
        } else {
            await userManagementService.removeFromRole(user.id, role.name);
        }
    } catch (e) {
        console.log('Error setting role:', e);
        role.selected = !role.selected;
    }
}

const getRoleMenuButtonId = (user: IUserWithSelectedRoles) => {
    return `menuButton-${user.id}`;
}

const getRoleSelectionMenuStyle = (user: IUserWithSelectedRoles): StyleValue => {
    const button = document.getElementById(getRoleMenuButtonId(user));
    const rect = button?.getBoundingClientRect();
    return {
        top: rect?.top + "px",
        left: rect?.right + "px",
    };
}

const isAllowedToManageRole = (role: ISelectedRole): boolean => {
    if (role.name.toUpperCase() === "SUPERADMIN") return false;
    if (identityStore.jwt?.isSuperAdmin) return true;
    return (identityStore.jwt?.isAdmin ?? false) && role.name.toUpperCase() !== "ADMIN";
};

</script>

<template>
    <div>
        <h2 class="text-center mb-3">Manage users</h2>
        <template v-if="!users">
            LOADING...
        </template>
        <template v-else>
            <form @submit="refresh">
                <label for="nameQuery">Search by username</label>
                <input id="nameQuery" v-model="filters.nameQuery" />
                <label for="includeOnlyNotApproved">Include only non-approved users?</label>
                <input type="checkbox" id="includeOnlyNotApproved" v-model="filters.includeOnlyNotApproved" />
                <input type="submit" class="btn btn-primary" @click="refresh" value="Apply" />
            </form>
            <div v-for="(user) in users" class="dashboard-item">
                {{ user.userName }}<br />
                <input type="submit" v-if="!user.isApproved" class="btn btn-success"
                    @click="event => approveUser(event, user)" value="Approve registration" />
                <button class="btn btn-outline-primary" :id="getRoleMenuButtonId(user)" @click="toggleRoleMenu(user)">Manage roles</button>
                <div class="popup-menu" :style="getRoleSelectionMenuStyle(user)" v-if="selectedUser?.id === user.id">
                    <div v-for="role in user.roles">
                        <label>
                            {{ role.name }}
                            <input type="checkbox" :disabled="!isAllowedToManageRole(role)" :checked="role.selected" @click="updateRole(user, role)" />
                        </label>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.dashboard-item {
    border-radius: 0.35rem;
    padding: 1rem;
    background-color: #d9f6ff;
}

.popup-menu {
    position: absolute;
    z-index: 1;
}
</style>