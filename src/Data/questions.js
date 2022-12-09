// @flow
type Questions = Array<{
  question: string,
  low?: string,
  medium?: string,
  high?: string,
}>;

export const questions1: Questions = [
  {
    question: 'Apakah anda menyikat gigi 2x sehari?',
    low: 'Ya',
    medium: '1 kali sehari',
    high: 'Tidak sama sekali',
  },
  {
    question: 'Apakah anda menyikat gigi pada setelah sarapan dan sebelum tidur?',
    low: 'Ya',
    medium: 'Tidak',
  },
  {
    question: 'Apakah anda tau cara sikat gigi yang benar?',
    low: 'Ya',
    medium: 'Tidak',
  },
  {
    question: 'Apakah anda menyikat gigi dengan pasta gigi berfluoride?',
    low: 'Ya',
    medium: 'Tidak',
  },
  {
    question: 'Apakah anda suka mengkonsumsi makanan manis dan lengket?',
    low: 'Tidak',
    medium: 'Kadang – kadang',
    high: 'Sering',
  },
  {
    question: 'Apakah Anda rutin kontrol ke dokter gigi 6 bulan sekali?',
    low: 'Ya',
    medium: 'Jika sakit saja',
    high: 'Tidak pernah',
  },
  {
    question: 'Berapa kali dalam sehari mengonsumsi snack?',
    low: 'Tidak pernah',
    medium: '1-3 kali sehari',
    high: 'Lebih dari 3 kali',
  },
];

export const questions2: Questions = [
  {
    question: 'Apakah ada gigi yang berlubang di rongga mulut Anda?',
    low: 'Tidak',
    medium: '1-2 lesi',
    high: '>=3 lesi',
  },
  {
    question: 'Apakah ada gigi yang dicabut gara-gara gigi berlubang dalam 3 tahun terakhir?',
    low: 'Tidak',
    medium: 'Ya',
  },
  {
    question: 'Apakah ada plak yang terlihat langsung pada gigi?',
    low: 'Tidak',
    medium: 'Ya',
  },
  {
    question: 'Adakah morfologi dan posisi gigi yang memengaruhi kebersihan rongga mulut ?',
    low: 'Tidak',
    medium: 'Ya',
  },
  {
    question: 'Apakah ada tambalan di sela-sela gigi?',
    low: 'Tidak',
    medium: 'Ya',
  },
  {
    question: 'Apakah ada parit gigi yang dalam?',
    low: 'Tidak',
    medium: 'Ya',
  },
  {
    question: 'Apakah ada akar gigi yang terlihat jelas?',
    low: 'Tidak',
    medium: 'Ya',
  },
  {
    question: 'Apakah ada tambalan yang berlebihan sehingga menjadi tempat menumpuknya makanan?',
    low: 'Tidak',
    medium: 'Ya',
  },
  {
    question: 'Apakah ada atau pernah menggunakan alat ortodonsi? (cekat / lepasan)',
    low: 'Tidak',
    medium: 'Ya',
  },
];