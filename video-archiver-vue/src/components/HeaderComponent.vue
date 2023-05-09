<script setup lang="ts">
import CrudDropdown from './CrudDropdown.vue';
import IdentityHeader from './IdentityHeader.vue';

</script>

<template>
    <header>
        <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
            <div className="container-fluid">
                <RouterLink className="navbar-brand" to="/">WebApp</RouterLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                    <ul className="navbar-nav flex-grow-1">
                        <li className="nav-item">
                            <RouterLink to="/" className="nav-link text-dark">Home</RouterLink>
                        </li>
                        <CrudDropdown />
                    </ul>

                    <ul className="navbar-nav">
                        <IdentityHeader />
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>