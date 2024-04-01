/**
* # Chunk
*
* Là một phần dữ liệu được truyền tải trong Stream.
*
* Khi làm việc với Stream, dữ liệu không được truyền đi cùng một lúc,
* mà sẽ được chia nhỏ thành nhiều phần để dễ dàng truyền tải và xử lý hơn,
* các phần này được gọi là Chunk.
*
* Kích thươc Chunk khác nhau tùy thuộc vào Stream và cách nó được cấu hình,
* một số cố định còn một số kích thước có thể thay đổi.
*/

/**
* # Stream
*
* Là một tập hợp dữ liệu được truyền tải theo thời gian (Audio, Video,...),
* hoạt động tương tự như một dòng nước chảy, dữ liệu được truyền đi liên tục,
* và người dùng có thể nhận và xử lý dữ liệu ngay lập tức mà không cần phải chờ đợi tải xuống toàn bộ dữ liệu.
*
* https://nodejs.org/api/stream.html
*/

/**
* # Các loại Stream
*
* @Readable Stream
*
* Dòng dữ liệu có thể đọc được, ví dụ như tệp tin, đầu vào của quá trình, hoặc kết nối mạng.
*
* @Writable Stream
*
* Dòng dữ liệu có thể có thể ghi được, ví dự như tệp tin, đầu ra của quá trình, hoặc kết nối mạng.
*
* @Duplex Stream
*
* Dòng dữ liệu vừa có thể đọc vừa có thể ghi, ví dụ như một socket mạng.
*/

/**
* # Kinh nghiệm áp dụng Stream
*
* Sử dụng các module Stream : fs-extra, http, net.
*
* Sử dụng các sự kiện errors để xử lý các lỗi xảy ra trong Stream.
*
* Sử dụng try-catch để bao bọc các tác vụ Stream.
*
* Sử dụng các chunk.
*
* Sử dụng pipe để kết nối các Stream với nhau.
*
* Sử dụng các phương thức pause() và resume() để tạm dừng và tiếp tục Stream.
*
* Sử dụng các phương thức unshift() và push() để thêm dữ liệu vào Stream.
*/

/**
* # Debug
*
* Sử dụng module Debug || node-inspector || stream-dump.
* Sử dụng trình gỡ lỗi Chrome để đặt breakpoint trong code Stream và xem giá trị của các biến.
*/