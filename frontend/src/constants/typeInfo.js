/**
 * Keterangan tiap tipe (Enneagram).
 * Berisi nama, label, tagline, deskripsi, sifat (traits), kekuatan (strengths),
 * tantangan (challenges), dan tips rekomendasi pengembangan diri.
 */
export const TYPE_INFO = {
    1: {
        name: "The Reformer",
        label: "Perfeksionis",
        tagline: "Idealis, teliti, dan berprinsip kuat.",
        description: "Anda memiliki standar tinggi, idealis, dan ingin segala sesuatu berjalan benar. Anda bertanggung jawab dan disiplin, namun sering terlalu keras menilai diri sendiri maupun orang lain.",
        traits: ["Teliti", "Disiplin", "Berprinsip", "Idealis"],
        strengths: "Jujur, bertanggung jawab, dan konsisten menjaga kualitas kerja.",
        challenges: "Mudah frustrasi bila hasil tidak sempurna dan cenderung terlalu kritis.",
        tips: [
            "Belajarlah menerima ketidaksempurnaan, baik pada diri sendiri maupun orang lain.",
            "Luangkan waktu untuk relaksasi tanpa merasa bersalah.",
            "Sadarilah bahwa 'cukup baik' seringkali sudah memadai."
        ],
    },
    2: {
        name: "The Helper",
        label: "Penolong",
        tagline: "Hangat, peduli, dan senang membantu.",
        description: "Anda hangat, empatik, dan mudah menyadari kebutuhan orang lain. Kebahagiaan Anda sering datang dari merasa dibutuhkan, namun kebutuhan pribadi kadang terabaikan.",
        traits: ["Empatik", "Murah hati", "Perhatian", "Suportif"],
        strengths: "Pandai membangun hubungan hangat dan membuat orang merasa diterima.",
        challenges: "Sulit berkata tidak dan cenderung mengabaikan kebutuhan diri sendiri.",
        tips: [
            "Belajarlah berkata tidak tanpa merasa bersalah.",
            "Luangkan waktu untuk memenuhi kebutuhan diri sendiri.",
            "Ungkapkan kebutuhan Anda secara langsung, bukan lewat bantuan."
        ],
    },
    3: {
        name: "The Achiever",
        label: "Pencapai",
        tagline: "Ambisius, adaptif, dan berorientasi target.",
        description: "Anda termotivasi oleh tujuan, efisien, dan pandai menyesuaikan diri. Pencapaian penting bagi Anda, tetapi kadang harga diri terlalu bergantung pada pengakuan orang lain.",
        traits: ["Ambisius", "Efisien", "Adaptif", "Percaya diri"],
        strengths: "Fokus pada hasil, produktif, dan mampu memotivasi orang di sekitar.",
        challenges: "Mudah terjebak workaholic dan menilai diri dari prestasi semata.",
        tips: [
            "Beri ruang untuk istirahat tanpa merasa harus selalu berprestasi.",
            "Nilai diri dari siapa Anda, bukan dari pencapaian saja.",
            "Luangkan waktu untuk mengenali perasaan yang sebenarnya."
        ],
    },
    4: {
        name: "The Individualist",
        label: "Individualis",
        tagline: "Sensitif, kreatif, dan mencari makna diri.",
        description: "Anda memiliki dunia emosi yang dalam, ekspresif, dan menghargai keunikan. Anda sering merasa berbeda dari orang lain dan terdorong menemukan jati diri serta makna dalam hidup.",
        traits: ["Kreatif", "Sensitif", "Autentik", "Ekspresif"],
        strengths: "Imajinatif, peka terhadap perasaan, dan mampu berkarya secara orisinal.",
        challenges: "Mudah larut dalam perasaan dan merasa kurang dimengerti.",
        tips: [
            "Fokus pada tindakan nyata, tidak hanya pada perasaan yang mendalam.",
            "Syukuri hal-hal yang sudah dimiliki, bukan yang kurang.",
            "Bangun rutinitas sederhana untuk menjaga stabilitas emosi."
        ],
    },
    5: {
        name: "The Investigator",
        label: "Pengamat",
        tagline: "Analitis, mandiri, dan haus pengetahuan.",
        description: "Anda pengamat yang tajam, mandiri, dan suka mendalami sesuatu. Anda menjaga energi dan privasi, sehingga kadang terlihat menjauh dari keramaian.",
        traits: ["Analitis", "Mandiri", "Objektif", "Penasaran"],
        strengths: "Berpikir mendalam, tenang, dan ahli memecahkan masalah kompleks.",
        challenges: "Cenderung menarik diri dan menunda bertindak sebelum merasa siap.",
        tips: [
            "Bagikan pemikiran dan perasaan Anda kepada orang terdekat.",
            "Ambil tindakan meski merasa belum tahu cukup banyak.",
            "Jadwalkan waktu untuk berinteraksi, bukan hanya menyendiri."
        ],
    },
    6: {
        name: "The Loyalist",
        label: "Setia",
        tagline: "Setia, waspada, dan bertanggung jawab.",
        description: "Anda setia, dapat diandalkan, dan selalu bersiap menghadapi kemungkinan risiko. Rasa aman dan dukungan dari orang tepercaya sangat berarti bagi Anda.",
        traits: ["Setia", "Waspada", "Andal", "Kooperatif"],
        strengths: "Berkomitmen, teliti mengantisipasi masalah, dan menjadi teman yang bisa dipercaya.",
        challenges: "Mudah cemas dan ragu mengambil keputusan tanpa kepastian.",
        tips: [
            "Percayai penilaian diri sendiri sebelum mencari kepastian dari orang lain.",
            "Ubah kekhawatiran menjadi langkah persiapan yang konkret.",
            "Beri diri kesempatan mencoba tanpa bayang-bayang skenario terburuk."
        ],
    },
    7: {
        name: "The Enthusiast",
        label: "Antusias",
        tagline: "Optimis, spontan, dan penuh energi.",
        description: "Anda ceria, penuh ide, dan menyukai pengalaman baru. Anda cenderung menjaga hidup tetap menyenangkan dan menghindari hal yang membosankan atau menyakitkan.",
        traits: ["Optimis", "Spontan", "Energik", "Serba bisa"],
        strengths: "Mudah menularkan semangat dan cepat melihat peluang.",
        challenges: "Sulit fokus menuntaskan sesuatu dan cenderung menghindari emosi tidak nyaman.",
        tips: [
            "Selesaikan satu hal sebelum beralih ke hal berikutnya.",
            "Beri ruang untuk merasakan emosi yang kurang nyaman.",
            "Latih kehadiran penuh di saat ini."
        ],
    },
    8: {
        name: "The Challenger",
        label: "Penantang",
        tagline: "Tegas, percaya diri, dan protektif.",
        description: "Anda kuat, tegas, dan berani mengambil kendali. Anda melindungi orang yang Anda pedulikan dan tidak mudah gentar menghadapi tantangan.",
        traits: ["Tegas", "Berani", "Protektif", "Mandiri"],
        strengths: "Pemimpin alami yang berani mengambil keputusan dan membela kebenaran.",
        challenges: "Bisa terlalu dominan dan sulit menunjukkan sisi rentan.",
        tips: [
            "Dengarkan pendapat orang lain sebelum mengambil keputusan.",
            "Tunjukkan sisi lembut Anda; kerentanan bukan kelemahan.",
            "Salurkan kekuatan untuk melindungi dan memberdayakan orang lain."
        ],
    },
    9: {
        name: "The Peacemaker",
        label: "Pendamai",
        tagline: "Tenang, menerima, dan pencinta damai.",
        description: "Anda tenang, mudah menerima perbedaan, dan pandai menciptakan suasana harmonis. Demi menjaga kedamaian, Anda kadang mengalah dan menghindari konflik.",
        traits: ["Tenang", "Sabar", "Penengah", "Menerima"],
        strengths: "Pendengar yang baik dan mampu menyatukan orang dengan pandangan berbeda.",
        challenges: "Cenderung menunda dan memendam keinginan sendiri.",
        tips: [
            "Ungkapkan pendapat dan keinginan Anda sendiri.",
            "Tetapkan prioritas dan langkah kecil yang konkret setiap hari.",
            "Hadapi konflik yang sehat, bukan menghindarinya."
        ],
    },
};
