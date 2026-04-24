const { BlogPost } = require('../src/models');

const seedBlogPosts = async () => {
  try {
    const blogPosts = [
      {
        title: 'Cách chăm sóc thú cưng khỏe mạnh',
        excerpt: 'Hướng dẫn chi tiết về cách nuôi dưỡng và chăm sóc thú cưng để chúng luôn khỏe mạnh và hạnh phúc.',
        content: `Chăm sóc thú cưng là một phần quan trọng trong việc nuôi dưỡng chúng. Để thú cưng luôn khỏe mạnh, bạn cần chú ý đến chế độ ăn uống, vận động và vệ sinh.

Đầu tiên, chế độ ăn uống cân bằng là yếu tố then chốt. Hãy chọn thức ăn phù hợp với độ tuổi và giống loài của thú cưng. Ngoài ra, đừng quên bổ sung vitamin và khoáng chất cần thiết.

Vận động đều đặn cũng rất quan trọng. Hãy dành thời gian chơi đùa với thú cưng hàng ngày để chúng có sức khỏe tốt.

Cuối cùng, vệ sinh sạch sẽ sẽ giúp thú cưng tránh được các bệnh tật. Hãy tắm rửa và cắt tỉa lông định kỳ.`,
        image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&h=300&fit=crop',
        author: 'PetShop Team',
        published: true
      },
      {
        title: 'Top 10 đồ chơi cho chó mèo',
        excerpt: 'Khám phá những món đồ chơi hot nhất cho thú cưng, giúp chúng vui chơi và phát triển toàn diện.',
        content: `Đồ chơi không chỉ giúp thú cưng giải trí mà còn hỗ trợ phát triển thể chất và trí tuệ. Dưới đây là top 10 đồ chơi được yêu thích nhất:

1. Bóng cao su - Lý tưởng cho chó năng động
2. Chuột nhồi bông - Mèo sẽ mê mẩn
3. Dây kéo - Giúp chó vận động
4. Túi đựng đồ ăn thông minh - Kết hợp ăn uống và chơi đùa
5. Đồ chơi laser - Cho mèo thích đuổi bắt
6. Xương nhai - Giúp làm sạch răng
7. Túi đựng đồ ăn chậm - Giúp chó ăn chậm và tập trung
8. Đồ chơi xếp hình - Phát triển trí tuệ
9. Bóng tennis - Bền và an toàn
10. Chuông nhỏ - Thu hút sự chú ý

Hãy chọn đồ chơi phù hợp với thú cưng của bạn!`,
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=300&fit=crop',
        author: 'PetShop Team',
        published: true
      },
      {
        title: 'Dinh dưỡng cho thú cưng',
        excerpt: 'Hiểu rõ về nhu cầu dinh dưỡng của chó mèo để chọn thức ăn phù hợp nhất.',
        content: `Dinh dưỡng đóng vai trò quan trọng trong sức khỏe của thú cưng. Mỗi giống loài và độ tuổi có nhu cầu dinh dưỡng khác nhau.

Đối với chó:
- Protein: 18-25% khẩu phần
- Chất béo: 5-15%
- Carbohydrate: 30-50%
- Vitamin và khoáng chất

Đối với mèo:
- Protein: 26-30% (mèo cần protein nhiều hơn chó)
- Chất béo: 9-15%
- Carbohydrate: 30-40%

Hãy chọn thức ăn chất lượng cao và tham khảo ý kiến bác sĩ thú y để có chế độ dinh dưỡng phù hợp nhất.`,
        image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600&h=300&fit=crop',
        author: 'PetShop Team',
        published: true
      },
      {
        title: 'Dấu hiệu mèo yêu bạn',
        excerpt: '10 dấu hiệu cho thấy mèo thật sự yêu thương và coi bạn là người bạn thân thiết.',
        content: `Mèo thường được cho là lạnh lùng, nhưng thực ra chúng rất tình cảm. Dưới đây là 10 dấu hiệu cho thấy mèo yêu bạn:

1. Chớp mắt chậm - Nụ hôn của mèo
2. Cọ đầu vào bạn - Để lại mùi hương
3. Đưa đuôi lên - Dấu hiệu tin tưởng
4. Kêu "meo meo" - Chỉ dành cho con người
5. Mang quà về - Chuột hoặc chim chết
6. Ngủ trên người bạn - Sự tin tưởng tuyệt đối
7. Liếm tay bạn - Hành động âu yếm
8. Đi theo khắp nơi - Không muốn xa bạn
9. Phản ứng khi bạn về nhà - Vui mừng chào đón
10. Chia sẻ lãnh thổ - Cho bạn vào không gian riêng

Mèo yêu bạn theo cách riêng của chúng!`,
        image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=300&fit=crop',
        author: 'PetShop Team',
        published: true
      },
      {
        title: 'Cách tắm cho chó mèo tại nhà',
        excerpt: 'Hướng dẫn chi tiết cách tắm cho thú cưng an toàn và hiệu quả tại nhà.',
        content: `Tắm cho thú cưng là việc làm cần thiết nhưng nhiều người lo lắng không biết làm sao cho đúng. Hãy làm theo các bước sau:

Chuẩn bị:
- Sữa tắm dành cho thú cưng
- Khăn mềm
- Máy sấy tóc (nếu cần)
- Ống tắm hoa sen

Các bước tắm:
1. Chuẩn bị nước ấm (khoảng 37-39°C)
2. Ướt toàn thân thú cưng
3. Thoa sữa tắm và massage nhẹ nhàng
4. Rửa sạch hoàn toàn
5. Lau khô bằng khăn
6. Sấy khô (nếu cần)

Lưu ý:
- Tắm không quá 2 lần/tuần
- Tránh nước vào tai và mắt
- Sử dụng sữa tắm chuyên dụng
- Thưởng thức ăn sau khi tắm

Thú cưng của bạn sẽ thơm tho và khỏe mạnh!`,
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=300&fit=crop',
        author: 'PetShop Team',
        published: true
      },
      {
        title: 'Giống chó phổ biến nhất Việt Nam',
        excerpt: 'Top các giống chó được yêu thích và nuôi nhiều nhất tại Việt Nam.',
        content: `Việt Nam có nhiều giống chó được yêu thích. Dưới đây là top các giống phổ biến:

1. Chihuahua - Nhỏ nhắn, dễ thương
2. Pug - Vẻ ngoài hài hước
3. Bulldog Pháp - Tính cách thân thiện
4. Corgi - Lông xù, đuôi cụp
5. Husky - Đôi mắt xanh đẹp
6. Golden Retriever - Thông minh, thân thiện
7. Beagle - Hay hoảng loạn
8. Pomeranian - Lông xù như sư tử
9. Shih Tzu - Nhỏ gọn, dễ nuôi
10. Alaska Malamute - To lớn, mạnh mẽ

Mỗi giống chó đều có ưu điểm riêng. Hãy chọn giống phù hợp với lối sống của bạn!`,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop',
        author: 'PetShop Team',
        published: true
      }
    ];

    for (const post of blogPosts) {
      await BlogPost.create(post);
    }

    console.log('Blog posts seeded successfully');
  } catch (error) {
    console.error('Error seeding blog posts:', error);
  }
};

module.exports = seedBlogPosts;