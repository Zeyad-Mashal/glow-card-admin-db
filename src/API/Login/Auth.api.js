const URL = "https://glow-card.onrender.com/api/v1/auth/login";

const Auth = async (setloading, setError, data, navigate) => {
    setloading(true)
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "accept-language": "ar"
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            setloading(false);
            localStorage.setItem('token', result.token);
            navigate(`/`);
        } else {
            if (response.status == 403) {
                setError(result.message)
                setloading(false);
            } else if (response.status == 404) {
                console.log(result.message);
                setError(result.message)
                setloading(false);
            } else if (response.status == 500) {
                console.log(result.message)
            }
            setloading(false)
        }
    } catch (error) {
        setError('An error occurred');
        setloading(false)
    }
}
export default Auth;