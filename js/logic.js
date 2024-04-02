document.addEventListener("DOMContentLoaded", function () {
    // Menambahkan event listener untuk event beforeunload
    window.addEventListener("beforeunload", function (event) {
      // Pesan peringatan yang akan ditampilkan pada dialog konfirmasi
      var pesanPeringatan =
        "Apakah Anda yakin ingin me-reload halaman? Data yang belum disimpan mungkin akan hilang.";
  
      // Standar untuk pesan peringatan di sebagian besar browser modern
      event.returnValue = pesanPeringatan;
  
      // Untuk browser yang mendukung standar terbaru
      return pesanPeringatan;
    });
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    var isAudioPlayed = {};
    var audioSedangDiputar = null;
  
    // Fungsi untuk memutar audio
    function putarAudio(audioId) {
      var audio = document.getElementById(audioId);
      var statusPemutaran = localStorage.getItem("statusPemutaran_" + audioId);
  
      if (
        !isAudioPlayed[audioId] &&
        !audioSedangDiputar &&
        (!statusPemutaran || statusPemutaran === "belum-diputar")
      ) {
        console.log("Audio belum diputar");
  
        audio.play();
        isAudioPlayed[audioId] = true;
        audioSedangDiputar = audio;
  
        // Menonaktifkan tombol setelah diputar
        document.querySelector('[data-audio="' + audioId + '"]').disabled = true;
  
        // Simpan status pemutaran ke local storage
        localStorage.setItem("statusPemutaran_" + audioId, "sudah-diputar");
  
        // Mendeteksi saat audio sedang diputar
        audio.addEventListener("playing", function () {
          console.log("Audio sedang diputar");
        });
  
        // Mendeteksi saat audio selesai diputar
        audio.addEventListener("ended", function () {
          console.log("Audio selesai diputar");
          audioSedangDiputar = null;
        });
      } else if (isAudioPlayed[audioId]) {
        console.log("Audio sudah diputar sebelumnya");
        document.querySelector('[data-audio="' + audioId + '"]').disabled = true;
      } else if (audioSedangDiputar) {
        console.log("Audio sedang diputar oleh audio lain");
      } else {
        console.log("Audio sudah diputar sebelumnya (dari local storage)");
        document.querySelector('[data-audio="' + audioId + '"]').disabled = true;
      }
    }
  
    // Cek status pemutaran saat memuat halaman
    var buttons = document.querySelectorAll(".playButton");
    buttons.forEach(function (button) {
      var audioId = button.getAttribute("data-audio");
      var statusPemutaran = localStorage.getItem("statusPemutaran_" + audioId);
  
      if (statusPemutaran && statusPemutaran === "sudah-diputar") {
        button.disabled = true;
      }
    });
  
    // Mendeteksi klik pada tombol
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var audioId = button.getAttribute("data-audio");
        putarAudio(audioId);
      });
    });
  
    // Mendeteksi klik pada tombol reset
    document.getElementById("resetButton").addEventListener("click", function () {
      // Reset status pemutaran di local storage
      localStorage.clear();
  
      // Mengaktifkan kembali semua tombol
      buttons.forEach(function (button) {
        button.disabled = false;
      });
  
      // Reset status pemutaran di variabel
      isAudioPlayed = {};
      audioSedangDiputar = null;
  
      console.log("Status pemutaran di-reset");
    });
  });