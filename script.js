// Data dan state aplikasi
const appState = {
    currentQueue: 'A001',
    currentOperator: 'Operator 1',
    waitingCount: 12,
    servedCount: 8,
    totalCount: 20,
    selectedQueue: 'A001',
    selectedOperator: 'Operator 1',
    queuePrefix: 'A',
    queueNumber: 1,
    operators: [
        { id: 1, name: 'Operator 1', icon: 'fa-user', available: true },
        { id: 2, name: 'Operator 2', icon: 'fa-user', available: true },
        { id: 3, name: 'Operator 3', icon: 'fa-user', available: true },
        { id: 4, name: 'Operator 4', icon: 'fa-user', available: true },
        { id: 5, name: 'Operator 5', icon: 'fa-user', available: true },
        { id: 6, name: 'Operator 6', icon: 'fa-user', available: true },
        { id: 7, name: 'Operator 7', icon: 'fa-user', available: true },
        { id: 8, name: 'Operator 8', icon: 'fa-user', available: true }
    ],
    queueHistory: [
        { queue: 'A008', operator: 'Operator 3', time: '10:25' },
        { queue: 'B005', operator: 'Operator 6', time: '10:18' },
        { queue: 'A007', operator: 'Operator 1', time: '10:12' },
        { queue: 'C003', operator: 'Operator 5', time: '10:05' },
        { queue: 'B004', operator: 'Operator 2', time: '09:55' },
        { queue: 'A006', operator: 'Operator 4', time: '09:48' },
        { queue: 'C002', operator: 'Operator 7', time: '09:40' },
        { queue: 'B003', operator: 'Operator 8', time: '09:32' }
    ],
    volume: 0.7
};

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set waktu saat ini
    updateCurrentTime();
    
    // Inisialisasi operator grid
    initializeOperatorGrid();
    
    // Inisialisasi riwayat antrian
    initializeQueueHistory();
    
    // Inisialisasi event listeners
    initializeEventListeners();
    
    // Update tampilan
    updateDisplay();
    
    // Update volume display
    updateVolumeDisplay();
}

function initializeOperatorGrid() {
    const operatorGrid = document.getElementById('operatorGrid');
    operatorGrid.innerHTML = '';
    
    appState.operators.forEach(operator => {
        const operatorBtn = document.createElement('div');
        operatorBtn.className = `operator-btn ${operator.name === appState.selectedOperator ? 'active' : ''}`;
        operatorBtn.innerHTML = `
            <i class="fas ${operator.icon}"></i>
            <span>${operator.name}</span>
        `;
        
        operatorBtn.addEventListener('click', () => {
            // Hapus kelas active dari semua operator
            document.querySelectorAll('.operator-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Tambahkan kelas active ke operator yang dipilih
            operatorBtn.classList.add('active');
            
            // Update operator yang dipilih
            appState.selectedOperator = operator.name;
            document.getElementById('selectedOperator').textContent = operator.name;
        });
        
        operatorGrid.appendChild(operatorBtn);
    });
}

function initializeQueueHistory() {
    const queueHistory = document.getElementById('queueHistory');
    queueHistory.innerHTML = '';
    
    appState.queueHistory.forEach(item => {
        const queueItem = document.createElement('div');
        queueItem.className = 'queue-item called';
        queueItem.innerHTML = `
            <div class="queue-number-small">${item.queue}</div>
            <div class="queue-operator-small">${item.operator}</div>
            <div class="queue-time-small">${item.time}</div>
        `;
        
        queueHistory.appendChild(queueItem);
    });
}

function initializeEventListeners() {
    // Tombol generate nomor antrian
    document.getElementById('generateQueue').addEventListener('click', generateQueueNumber);
    
    // Tombol panggil antrian
    document.getElementById('callQueue').addEventListener('click', callQueue);
    
    // Tombol antrian selanjutnya
    document.getElementById('nextQueue').addEventListener('click', nextQueue);
    
    // Tombol reset antrian
    document.getElementById('resetQueue').addEventListener('click', resetQueue);
    
    // Input nomor antrian
    document.getElementById('queueNumber').addEventListener('change', function() {
        appState.queueNumber = parseInt(this.value);
        updateSelectedQueue();
    });
    
    // Pilihan awalan antrian
    document.getElementById('queuePrefix').addEventListener('change', function() {
        appState.queuePrefix = this.value;
        updateSelectedQueue();
    });
    
    // Slider volume
    document.getElementById('volumeSlider').addEventListener('input', function() {
        appState.volume = parseFloat(this.value);
        updateVolumeDisplay();
    });
}

function updateDisplay() {
    // Update antrian saat ini
    document.getElementById('currentQueue').textContent = appState.currentQueue;
    document.getElementById('currentOperator').textContent = appState.currentOperator;
    
    // Update informasi antrian
    document.getElementById('waitingCount').textContent = appState.waitingCount;
    document.getElementById('servedCount').textContent = appState.servedCount;
    document.getElementById('totalCount').textContent = appState.totalCount;
    
    // Update antrian yang dipilih
    document.getElementById('selectedQueue').textContent = appState.selectedQueue;
    document.getElementById('selectedOperator').textContent = appState.selectedOperator;
}

function updateSelectedQueue() {
    // Format nomor antrian dengan 3 digit
    const formattedNumber = appState.queueNumber.toString().padStart(3, '0');
    appState.selectedQueue = `${appState.queuePrefix}${formattedNumber}`;
    document.getElementById('selectedQueue').textContent = appState.selectedQueue;
}

function updateVolumeDisplay() {
    document.getElementById('volumeValue').textContent = `${Math.round(appState.volume * 100)}%`;
}

function generateQueueNumber() {
    // Generate nomor acak antara 1-999
    appState.queueNumber = Math.floor(Math.random() * 999) + 1;
    document.getElementById('queueNumber').value = appState.queueNumber;
    
    // Update antrian yang dipilih
    updateSelectedQueue();
    
    // Tambah jumlah antrian menunggu
    appState.waitingCount++;
    appState.totalCount++;
    
    // Update tampilan
    updateDisplay();
    
    // Beri feedback visual
    const generateBtn = document.getElementById('generateQueue');
    generateBtn.style.backgroundColor = '#1db6b4';
    setTimeout(() => {
        generateBtn.style.backgroundColor = '';
    }, 300);
}

function callQueue() {
    // Update antrian saat ini
    appState.currentQueue = appState.selectedQueue;
    appState.currentOperator = appState.selectedOperator;
    
    // Update waktu panggilan
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0');
    document.getElementById('currentTime').textContent = `Dipanggil: ${timeString}`;
    
    // Update statistik
    appState.waitingCount = Math.max(0, appState.waitingCount - 1);
    appState.servedCount++;
    
    // Tambahkan ke riwayat antrian
    appState.queueHistory.unshift({
        queue: appState.selectedQueue,
        operator: appState.selectedOperator,
        time: timeString
    });
    
    // Batasi riwayat menjadi 8 item terbaru
    if (appState.queueHistory.length > 8) {
        appState.queueHistory.pop();
    }
    
    // Update tampilan
    updateDisplay();
    initializeQueueHistory();
    
    // Putar suara panggilan
    playCallSound();
    
    // Panggil Text-to-Speech untuk membacakan nomor antrian
    speakQueueCall();
    
    // Beri feedback visual
    const callBtn = document.getElementById('callQueue');
    callBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        callBtn.style.transform = '';
    }, 300);
}

function nextQueue() {
    // Generate nomor antrian berikutnya
    appState.queueNumber++;
    document.getElementById('queueNumber').value = appState.queueNumber;
    
    // Update antrian yang dipilih
    updateSelectedQueue();
    
    // Beri feedback visual
    const nextBtn = document.getElementById('nextQueue');
    nextBtn.style.backgroundColor = '#e68900';
    setTimeout(() => {
        nextBtn.style.backgroundColor = '';
    }, 300);
}

function resetQueue() {
    // Konfirmasi reset
    if (confirm('Apakah Anda yakin ingin mereset antrian? Tindakan ini tidak dapat dibatalkan.')) {
        // Reset data antrian
        appState.currentQueue = 'A001';
        appState.currentOperator = 'Operator 1';
        appState.waitingCount = 0;
        appState.servedCount = 0;
        appState.totalCount = 0;
        appState.selectedQueue = 'A001';
        appState.selectedOperator = 'Operator 1';
        appState.queuePrefix = 'A';
        appState.queueNumber = 1;
        appState.queueHistory = [];
        
        // Reset input
        document.getElementById('queuePrefix').value = 'A';
        document.getElementById('queueNumber').value = 1;
        document.getElementById('currentTime').textContent = 'Dipanggil: --:--';
        
        // Update tampilan
        updateDisplay();
        initializeQueueHistory();
        initializeOperatorGrid();
        
        // Beri feedback visual
        const resetBtn = document.getElementById('resetQueue');
        resetBtn.style.backgroundColor = '#d32f2f';
        setTimeout(() => {
            resetBtn.style.backgroundColor = '';
        }, 300);
        
        // Tampilkan pesan sukses
        alert('Antrian telah direset!');
    }
}

function playCallSound() {
    const audio = document.getElementById('callSound');
    audio.volume = appState.volume;
    audio.currentTime = 0;
    audio.play();
}

function speakQueueCall() {
    // Cek apakah browser mendukung Web Speech API
    if ('speechSynthesis' in window) {
        // Buat teks untuk diucapkan
        const queueNumber = appState.currentQueue;
        const operatorName = appState.currentOperator;
        const speechText = `Nomor antrian ${queueNumber.split('').join(' ')}, silakan menuju ke ${operatorName}`;
        
        // Buat objek utterance
        const utterance = new SpeechSynthesisUtterance(speechText);
        
        // Set pengucapan bahasa Indonesia jika tersedia
        utterance.lang = 'id-ID';
        utterance.volume = appState.volume;
        utterance.rate = 0.9; // Kecepatan bicara
        
        // Pilih suara wanita jika tersedia
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
            voice.lang.includes('id') || voice.lang.includes('ID') || 
            (voice.name.toLowerCase().includes('female') && voice.lang.includes('en'))
        );
        
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
        
        // Ucapkan teks
        speechSynthesis.speak(utterance);
    } else {
        // Fallback jika browser tidak mendukung
        console.log('Text-to-Speech tidak didukung di browser ini.');
    }
}

function updateCurrentTime() {
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0');
    
    // Update waktu secara real-time setiap menit
    setTimeout(updateCurrentTime, 60000);
    
    // Update estimasi waktu tunggu berdasarkan jumlah antrian
    const estimateMinutes = appState.waitingCount * 5;
    document.getElementById('estimateTime').textContent = 
        estimateMinutes > 0 ? `${estimateMinutes} menit` : 'Segera dilayani';
}