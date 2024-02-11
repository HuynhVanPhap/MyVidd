/**
* # Validator
*
* yarn add express-validator
*
* @Terms
*
* &sanitizers
* Ám chỉ những function giúp cho dữ liệu đầu vào không chứa các kí tự "nhạy cảm" (Escape, '/', Space,...)
* trim(), escape() [Xóa kí tự escape trong dữ liệu],...
*
* @link
*
* https://stackabuse.com/form-data-validation-in-nodejs-with-express-validator/
*/

/**
* # Session
*
* yarn add express-session
*
* Session Store (Nơi quản lý lưu trữ Session) phải được install riêng
* Mặc định Session Store của express-session là một instance MemoryStore, không phải được lưu trong file
* nên khi server bị reset thì đồng nghĩa session data mất
*/

/**
* # Flash data
*
* https://stackoverflow.com/questions/23160743/how-to-send-flash-messages-in-express-4-0
*/