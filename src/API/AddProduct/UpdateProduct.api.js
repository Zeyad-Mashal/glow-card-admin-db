const URL = "https://glow-card.onrender.com/api/v1/product/update/";

const buildUrlWithOffers = (baseUrl, wantsOffers) => {
    if (!wantsOffers) return baseUrl;
    try {
        const u = new URL(baseUrl);
        u.searchParams.set("offers", "true");
        return u.toString();
    } catch {
        const sep = baseUrl.includes("?") ? "&" : "?";
        return `${baseUrl}${sep}offers=true`;
    }
};

const UpdateProduct = async (
    setLoading,
    setError,
    productId,
    setShowEditModal,
    data,
    getAllProducts,
    offers = false
) => {
    const wantsOffers =
        offers === true || offers === "true" || offers === 1;
    setLoading(true)
    try {
        const token = localStorage.getItem('token');
        const basePath = `${URL}${productId}`;
        const requestUrl = buildUrlWithOffers(basePath, wantsOffers);
        if (wantsOffers) {
            console.log("[Product][update] offers=true URL:", requestUrl);
        }
        const response = await fetch(requestUrl, {
            method: 'PUT',
            headers: {
                "authorization": `glowONW${token}`
            },
            body: data
        });

        const result = await response.json();

        if (response.ok) {
            setLoading(false);
            setShowEditModal(false);
            getAllProducts();
        } else {
            if (response.status == 404) {
                setError(result.message)
                setLoading(false);
            } else if (response.status == 500) {
                console.log(result.message);
                setError(result.message)
                setLoading(false);
            }
            setLoading(false)
        }
    } catch (error) {
        setError('An error occurred');
        setLoading(false)
    }
}
export default UpdateProduct;