<template>
    <div class="btn-group">
    <button type="button" class="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        ADMIN
    </button>
    <ul class="dropdown-menu">
        <li class="nav-item">
            <a class="dropdown-item nav-link text-dark" asp-area="Admin" asp-controller="UserManagement" asp-action="Index">Manage users</a>
        </li>
        <li class="nav-item">
            <RouterLink :to="{name: 'approveQueueItems'}" class="dropdown-item nav-link text-dark">
                Manage queue items
            </RouterLink>
        </li>
    </ul>
</div>
</template>