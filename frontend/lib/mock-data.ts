import { Transcript } from './types';

export const mockTranscripts: Transcript[] = [
  {
    id: '1',
    title: 'Delivery Confirmation.wav',
    dateCreated: new Date(2025, 4, 14),
    size: '5MB',
    content: {
      shipper: [
        'Xin chào! Chị có đơn hàng.',
        'Vâng, đơn hàng của chị đây. Xin ký nhận.'
      ],
      customer: [
        'OK.',
        'Cảm ơn anh nhiều.'
      ]
    }
  },
  {
    id: '2',
    title: 'Address Clarification.wav',
    dateCreated: new Date(2025, 4, 14),
    size: '5MB',
    content: {
      shipper: [
        'Xin chào! Tôi đang tìm địa chỉ này.',
        'Cảm ơn, tôi sẽ đến ngay.'
      ],
      customer: [
        'Vâng, bạn đi thẳng rồi rẽ phải.',
        'OK, tôi sẽ đợi.'
      ]
    }
  },
  {
    id: '3',
    title: 'Payment Confirmation.wav',
    dateCreated: new Date(2025, 4, 14),
    size: '5MB',
    content: {
      shipper: [
        'Xin chào! Đơn hàng của bạn là 250,000 đồng.',
        'Bạn thanh toán bằng tiền mặt hay chuyển khoản?'
      ],
      customer: [
        'Chào anh, để tôi xem hàng trước.',
        'Tôi sẽ trả tiền mặt.'
      ]
    }
  },
  {
    id: '4',
    title: 'Delivery Instructions.wav',
    dateCreated: new Date(2025, 4, 14),
    size: '5MB',
    content: {
      shipper: [
        'Chào chị, tôi có thể giao hàng lúc mấy giờ?',
        'Vâng, tôi sẽ giao lúc 3 giờ chiều.'
      ],
      customer: [
        'Chào anh, sau 2 giờ chiều được không?',
        'Tốt, cảm ơn anh.'
      ]
    }
  }
];

export const getTranscripts = () => {
  return mockTranscripts.map(transcript => ({
    id: transcript.id,
    title: transcript.title,
    dateCreated: transcript.dateCreated,
    size: transcript.size,
    preview: transcript.content.shipper[0]
  }));
};

export const getTranscriptById = (id: string) => {
  return mockTranscripts.find(transcript => transcript.id === id);
};

export const saveTranscript = (transcript: Omit<Transcript, 'id' | 'dateCreated'>) => {
  const newTranscript: Transcript = {
    ...transcript,
    id: Math.random().toString(36).substring(2, 9),
    dateCreated: new Date()
  };
  mockTranscripts.unshift(newTranscript);
  return newTranscript;
};