import router from ".";

export async function redirectToError(error: string | null = null) {
    return await router.push({ name: "error", query: { error: error } });
}