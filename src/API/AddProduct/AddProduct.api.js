const URL = "https://glow-card.onrender.com/api/v1/product/add";

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

const AddProduct = async (
    setloading,
    setError,
    data,
    setShowAddModal,
    getAllProducts,
    offers = false
) => {
    const wantsOffers =
        offers === true || offers === "true" || offers === 1;
    setloading(true)
    try {
        const token = localStorage.getItem('token');
        const requestUrl = buildUrlWithOffers(URL, wantsOffers);
        if (wantsOffers) {
            console.log("[Product][add] offers=true URL:", requestUrl);
        }
        const response = await fetch(requestUrl, {
            method: 'POST',
            headers: {
                "authorization": `glowONW${token}`
            },
            body: data,
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
            setloading(false);
            setShowAddModal(false);
            getAllProducts()
        } else {
            if (response.status == 400) {
                setError(result.message)
                setloading(false);
            } else if (response.status == 500) {
                console.log(result.message);
                setError(result.message)
                setloading(false);
            }
            setloading(false)
        }
    } catch (error) {
        setError('An error occurred');
        setloading(false)
        console.log(error);
    }
}

export default AddProduct;