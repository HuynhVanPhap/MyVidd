/**
* # Aggregation Operators ($push,...)
*
* https://www.mongodb.com/docs/manual/reference/operator/aggregation/
* https://www.mongodb.com/docs/manual/crud/
*/

/**
* # Update field within array with '$' on MongoDB
*
* https://www.mongodb.com/docs/manual/reference/operator/update/positional/
* https://www.mongodb.com/docs/manual/reference/operator/update/positional-filtered/
* https://www.mongodb.com/community/forums/t/update-field-within-array-help/213010
*/

/**
* # Connection string
*
* https://www.mongodb.com/docs/manual/reference/connection-string/
*/

/**
* # Get specific part of document
*
* https://stackoverflow.com/questions/5301795/get-specific-part-of-document
*/

/**
* # Get specific part of document on mongoose
*
* https://mongoosejs.com/docs/queries.html
*/

/**
* # Chunk data on MongoDB
*
* @Sharding
*
* Là kĩ thuật phân tán dữ liệu trên nhiều máy chủ (Shard) trong một Cluster MongoDB
* Nó giúp chia nhỏ bộ sưu tập dữ liệu lớn thành các phần nhỏ hơn, dễ quản lý và dễ truy cập hơn,
* khi thực hiện truy vấn, MongoDB sẽ tự động định vị (Shard) chứa dữ liệu cần thiết và trả về kết quả.
*
* Thích hợp dùng với các Collection.
*
* [Ưu điểm]
*
* Cải thiện hiệu suất truy vấn cho bộ sưu tập dữ liệu lớn.
* Khả năng mở rộng cao, dễ dàng thêm shard mới khi lượng dữ liệu tăng.
* Tăng tính sẵn sàng dữ liệu, giảm thiểu ảnh hưởng khi một shard gặp sự cố.

* [Khuyết điểm]
*
* Tăng độ phức tạp cho việc quản lý và vận hành Cluster MongoDB.
* Yêu cầu cấu hình và tối ưu hóa Shard key cẩn thận, để đảm bảo hiệu quả phân tán.
*
* https://www.mongodb.com/docs/manual/tutorial/split-chunks-in-sharded-cluster/
*
* @Paging
*
* Là kĩ thuật chia nhỏ kết quả truy vấn thành nhiều trang (paging) nhỏ hơn,
* dễ dàng quản lý và sử dụng.
* Có thể sử dụng thêm tham số "limit" để chỉ định số lượng document trong mỗi paging,
* và "skip" để chỉ định vị trí bắt đầu lấy dữ liệu.
*
* Thích hợp dùng với các Document.
*
* [Ưu điểm]
*
* Đơn giản và dễ dàng sử dụng hơn Sharding.
* Thích hợp cho các trường hợp truy xuất dữ liệu theo từng phần nhỏ.
*
* [Nhược điểm]
*
* Hiệu suất có thể chậm hơn Sharding, đặc biệt khi cần truy xuất nhiều dữ liệu.
* Không phù hợp cho các trường hợp truy suất toàn bộ bộ sưu tập dữ liệu (Collection).
*
* https://www.mongodb.com/docs/manual/core/sharding-data-partitioning/
*/

/**
# Query and Projection Operators
*
* https://www.mongodb.com/docs/manual/reference/operator/query/
*/

/**
* # Text Index (full-text search)
*
* Là một loại index được thiết kế để tối ưu hóa việc tìm kiếm trong các tài liệu văn bản.
* Text index có thể lưu trữ và phân tích các từ, cụm từ, và các yếu tố ngữ nghĩa khác trong
* tài liệu để giúp tìm kiếm nhanh chóng và chính xác hơn.
*
* https://www.mongodb.com/docs/manual/core/indexes/index-types/index-text/#std-label-index-type-text
* https://www.mongodb.com/docs/manual/reference/operator/query/text/
*/

/**
* # Search Index
*
* Là một cấu trúc dữ liệu được sử dụng để tăng tốc độ tìm kiếm dữ liệu trong một tập dữ liệu lớn.
* Search index có thể được sử dụng để tìm kiếm nhiều loại dữ liệu khác nhau, bao gồm văn bản, số,
* ngày tháng, v.v.
*
* https://www.mongodb.com/docs/atlas/atlas-search/create-index/
*/