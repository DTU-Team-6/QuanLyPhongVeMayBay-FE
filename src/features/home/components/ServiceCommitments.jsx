import shieldCheckIcon from '../../../assets/shield-check.svg';
import ticketCheckIcon from '../../../assets/ticket-check.svg';
import headsetIcon from '../../../assets/headset.svg';

/**
 * Khối Cam kết dịch vụ phòng vé theo chuẩn Figma (node 186:8994)
 */
export default function ServiceCommitments() {
  const commitments = [
    {
      icon: shieldCheckIcon,
      title: 'Đặt vé an tâm',
      description: 'Giá minh bạch, xác nhận rõ ràng',
    },
    {
      icon: ticketCheckIcon,
      title: 'Vé chính hãng',
      description: 'Đối tác các hãng hàng không uy tín',
    },
    {
      icon: headsetIcon,
      title: 'Hỗ trợ tận tâm',
      description: 'Đồng hành trước và sau chuyến bay',
    },
  ];

  return (
    <section className="bg-white border-y border-[#e2e8f0] w-full py-8 px-6 lg:px-[120px]">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
        {commitments.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-[#f0f9ff] flex items-center justify-center shrink-0">
              <img src={item.icon} alt="" className="size-6" />
            </div>
            <div className="flex flex-col">
              <h4 className="font-semibold text-[#334155] text-[14px]">
                {item.title}
              </h4>
              <p className="text-[#64748b] text-[12px]">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
