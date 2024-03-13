const useAuthData = (session) => {
    const auth = {
        _id: session.user_id,
        name: session.user_name,
        email: session.user_email,
        image: session.user_image,
    }

    return Object.keys(session).length > 0 ? auth : {};
}

export default useAuthData;