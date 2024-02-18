const IsVideoEmpty = async (value, { req }) => {
    if (req.files['video'] == undefined) {
        return Promise.reject();
    }
}

export default IsVideoEmpty;