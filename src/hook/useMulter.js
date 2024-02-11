import multer from 'multer';

const useMulter = (option = {}) => {
    const upload = multer({
        dest: '/tmp',
        preservePath: true,
        ...option,
    });

    return upload;
}

export default useMulter;