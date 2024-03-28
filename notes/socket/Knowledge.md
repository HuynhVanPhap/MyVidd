/**
* # Introduce
*
* Socket.IO là thư viện giúp xây dựng nên hệ thống real-time.
*
* Hệ thống real-time sẽ là cầu nối giữa client và server,
* nó đảm nhận trách nhiện nhận và phát dữ liệu theo thời gian thực từ server đến các client.
*/

/**
* Thành phần
*
* Socket.IO gồm 2 thành phần
*
* @socket.io package
*
* Được biết như là một Server sẽ được tích hợp (hoặc mount)
* với NodeJS HTTP Server (Server).
*
* yarn add socket.io
*
* @socket.io-client package
*
* Được biết đến là một thư viện được tải bên phía trình duyệt (Client).
*
* Copy "<script src="/socket.io/socket.io.js"></script>" của socket.io vào file html,
* nếu đã install socket.io hoặc cũng có thể yarn add socket.io-client (nếu chưa có).
*
* Hoặc có thể sử dụng CDN <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
*/

/**
* # Connection state recovery
*
* Là giải pháp cho việc ngắt kết nối mạng tạm thời mà không cần phải đồng bộ hóa trạng thái client
*/

/**
* # Socket instance
*
* Mỗi socket sẽ tương tác (Quản lý) một client
* Cứ mỗi một connection được kết nối, thì sẽ có một socket phục vụ giữa server - client
* Mỗi socket sẽ có một socketId riêng biệt
*
* @Socket Middleware
*
* Là những đoạn code sẽ được thực thi mỗi gói tin đến (Khi lắng nghe event)
*/

/**
* # Rooms
*/

/**
* # socket.handshake
*
* Là dữ liệu mà socket-client sẽ gửi với mỗi connection được thiết lập tới socket-server.
* const socket = io(handshake);
*/

/**
* # Socket.IO: How it works, when to use it, and how to get started
*
* https://ably.com/topic/socketio
*/
