const URL = "https://glow-card.onrender.com/api/v1/coupon/create";
const token = localStorage.getItem('token');
const CreateCoupon = async (setloading, setError, data, setModal, getAllCoupons) => {
    setloading(true)
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": `glowONW${token}`
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            setloading(false);
            setModal(false)
            getAllCoupons()
        } else {
            if (response.status == 400) {
                setError(result.message)
                setloading(false);
                console.log(result.message);

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
    }
}
export default CreateCoupon;