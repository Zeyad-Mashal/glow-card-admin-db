const URL = "https://glow-card.onrender.com/api/v1/foundation/removeFromRegion";
const token = localStorage.getItem("token");
const RemoveLinkedRegion = async (setLoading, setError, regionId, foundationId, getAllFoundations, setLinkRegionModal) => {
    setLoading(true)

    try {
        const response = await fetch(`${URL}?regionId=${regionId}&foundationId=${foundationId}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`
            }
        });

        const result = await response.json();

        if (response.ok) {
            setLoading(false);
            setLinkRegionModal(false);
            getAllFoundations()
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
export default RemoveLinkedRegion;