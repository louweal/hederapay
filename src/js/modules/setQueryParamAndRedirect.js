export const setQueryParamAndRedirect = function setQueryParamAndRedirect(key, value) {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set(key, value); // Add the parameter to the URL
    window.location.href = currentUrl.href; // Redirect to the new URL with the additional parameter
};
