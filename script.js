const URL = "/my_model/";
let model, webcam, labelContainer, maxPredictions;
let isInitialized = false;
let isPaused = false;

// กำหนดภาพตัวอย่างและข้อมูลอุปกรณ์
const deviceData = {
    "Cables": {
        image: "images/Cables.jpg",
        thai: "สายเคเบิล",
        description: "สายเชื่อมต่อสำหรับอุปกรณ์คอมพิวเตอร์ เช่น สาย USB, HDMI, และสายไฟ",
        type: "อุปกรณ์เชื่อมต่อ",
        category: "อุปกรณ์เสริม"
    },
    "Case": {
        image: "images/Case.jpg",
        thai: "เคสคอมพิวเตอร์",
        description: "โครงสร้างหลักที่บรรจุส่วนประกอบต่างๆ ของคอมพิวเตอร์",
        type: "เคสและโครงสร้าง",
        category: "ฮาร์ดแวร์หลัก"
    },
    "Cpu": {
        image: "images/Cpu.jpg",
        thai: "หน่วยประมวลผลกลาง",
        description: "สมองของคอมพิวเตอร์ที่ประมวลผลข้อมูลและคำสั่งต่างๆ",
        type: "ตัวประมวลผล",
        category: "ฮาร์ดแวร์หลัก"
    },
    "Gpu": {
        image: "images/Gpu.jpg",
        thai: "การ์ดจอ",
        description: "ประมวลผลกราฟิกและการแสดงผลภาพ เหมาะสำหรับเกมและงานกราฟิก",
        type: "การ์ดกราฟิก",
        category: "ฮาร์ดแวร์หลัก"
    },
    "Hdd": {
        image: "images/Hdd.jpg",
        thai: "ฮาร์ดดิสก์",
        description: "อุปกรณ์จัดเก็บข้อมูลแบบถาวร สำหรับเก็บไฟล์และระบบปฏิบัติการ",
        type: "อุปกรณ์จัดเก็บ",
        category: "ฮาร์ดแวร์หลัก"
    },
    "Headset": {
        image: "images/Headset.jpg",
        thai: "หูฟัง",
        description: "อุปกรณ์สำหรับฟังเสียงและสื่อสาร มีไมโครโฟนในตัว",
        type: "อุปกรณ์เสียง",
        category: "อุปกรณ์เสริม"
    },
    "Keyboard": {
        image: "images/keyboard.jpg",
        thai: "แป้นพิมพ์",
        description: "อุปกรณ์ป้อนข้อมูลแบบข้อความและควบคุมคอมพิวเตอร์",
        type: "อุปกรณ์ป้อนข้อมูล",
        category: "อุปกรณ์เสริม"
    },
    "Microphone": {
        image: "images/Microphone.jpg",
        thai: "ไมโครโฟน",
        description: "อุปกรณ์รับเสียงและบันทึกเสียง สำหรับการสื่อสารและบันทึก",
        type: "อุปกรณ์เสียง",
        category: "อุปกรณ์เสริม"
    },
    "Monitor": {
        image: "images/Monitor.jpg",
        thai: "จอคอมพิวเตอร์",
        description: "อุปกรณ์แสดงผลข้อมูลและภาพจากคอมพิวเตอร์",
        type: "อุปกรณ์แสดงผล",
        category: "ฮาร์ดแวร์หลัก"
    },
    "Motherboard": {
        image: "images/Motherboard.jpg",
        thai: "เมนบอร์ด",
        description: "แผงวงจรหลักที่เชื่อมต่อส่วนประกอบต่างๆ ของคอมพิวเตอร์",
        type: "แผงวงจรหลัก",
        category: "ฮาร์ดแวร์หลัก"
    },
    "Mouse": {
        image: "images/Mouse.jpg",
        thai: "เมาส์",
        description: "อุปกรณ์ชี้ตำแหน่งและควบคุมคอมพิวเตอร์ผ่านการเคลื่อนไหว",
        type: "อุปกรณ์ป้อนข้อมูล",
        category: "อุปกรณ์เสริม"
    },
    "Ram": {
        image: "images/Ram.jpg",
        thai: "หน่วยความจำ",
        description: "หน่วยความจำชั่วคราวสำหรับการประมวลผลและเก็บข้อมูลระหว่างใช้งาน",
        type: "หน่วยความจำ",
        category: "ฮาร์ดแวร์หลัก"
    },
    "Speakers": {
        image: "images/Speakers.jpg",
        thai: "ลำโพง",
        description: "อุปกรณ์ออกเสียงและเล่นเสียงจากคอมพิวเตอร์",
        type: "อุปกรณ์เสียง",
        category: "อุปกรณ์เสริม"
    },
    "Webcam": {
        image: "images/Webcam.jpg",
        thai: "เว็บแคม",
        description: "กล้องสำหรับการสื่อสารและบันทึกวิดีโอผ่านเครือข่าย",
        type: "อุปกรณ์บันทึกภาพ",
        category: "อุปกรณ์เสริม"
    }
};

const hardwareData = [
    {
        id: 1,
        name: "HDD (Hard Disk Drive)",
        description: "อุปกรณ์จัดเก็บข้อมูลแบบหมุนที่ใช้ในคอมพิวเตอร์ส่วนใหญ่",
        image: "images/hdd.jpg",
        category: "storage"
    },
    {
        id: 2,
        name: "RAM (Random Access Memory)",
        description: "หน่วยความจำชั่วคราวที่ใช้ในการประมวลผลข้อมูล",
        image: "images/ram.jpg",
        category: "memory"
    },
    {
        id: 3,
        name: "CPU (Central Processing Unit)",
        description: "หน่วยประมวลผลกลางที่ทำหน้าที่ประมวลผลคำสั่ง",
        image: "images/cpu.jpg",
        category: "processor"
    },
    {
        id: 4,
        name: "GPU (Graphics Processing Unit)",
        description: "หน่วยประมวลผลกราฟิกที่ใช้ในการเรนเดอร์ภาพ",
        image: "images/gpu.jpg",
        category: "graphics"
    },
    {
        id: 5,
        name: "Motherboard",
        description: "แผงวงจรหลักที่เชื่อมต่อส่วนประกอบต่างๆ ของคอมพิวเตอร์",
        image: "images/motherboard.jpg",
        category: "essential"
    },
    {
        id: 6,
        name: "SSD (Solid State Drive)",
        description: "อุปกรณ์จัดเก็บข้อมูลแบบใหม่ ที่มีความเร็วสูงกว่า HDD หลายเท่า",
        image: "images/ssd.jpg",
        category: "storage"
    },
    {
        id: 7,
        name: "Power Supply Unit (PSU)",
        description: "อุปกรณ์จ่ายไฟให้กับชิ้นส่วนต่างๆ ในคอมพิวเตอร์",
        image: "images/psu.jpg",
        category: "essential"
    },
    {
        id: 8,
        name: "Monitor",
        description: "จอแสดงผลสำหรับแสดงภาพและข้อมูลต่างๆ",
        image: "images/monitor.jpg",
        category: "peripheral"
    },
    {
        id: 9,
        name: "Keyboard",
        description: "อุปกรณ์รับข้อมูลหลักสำหรับพิมพ์ข้อความและคำสั่ง",
        image: "images/keyboard.jpg",
        category: "peripheral"
    },
    {
        id: 10,
        name: "Mouse",
        description: "อุปกรณ์ชี้ตำแหน่งและควบคุมการทำงานบนหน้าจอ",
        image: "images/mouse.jpg",
        category: "peripheral"
    }
];

// เพิ่มฟังก์ชันสำหรับแสดงรายละเอียดเพิ่มเติม
function showDetails(id) {
    const hardware = hardwareData.find(h => h.id === id);
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
<div class="modal-content">
    <span class="close">&times;</span>
    <img src="${hardware.image}" alt="${hardware.name}" class="modal-image">
    <h2>${hardware.name}</h2>
    <p>${hardware.description}</p>
    <div class="specs">
        <h3>คุณสมบัติเด่น:</h3>
        <ul>
            ${getHardwareSpecs(id)}
        </ul>
    </div>
</div>
`;
    document.body.appendChild(modal);

    const close = modal.querySelector('.close');
    close.onclick = () => modal.remove();
    window.onclick = (e) => {
        if (e.target === modal) modal.remove();
    }
}

async function init() {
    if (isInitialized) return;

    try {
        // อัพเดทสถานะ
        updateStatus("กำลังโหลดโมเดล AI...", "loading");

        // ซ่อน hero และแสดง detection section
        document.getElementById('hero-section').style.display = 'none';
        document.getElementById('detection-section').style.display = 'block';

        // โหลดโมเดล
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        updateStatus("กำลังเปิดกล้อง...", "loading");

        // เปิดกล้อง
        const flip = true;
        webcam = new tmImage.Webcam(400, 400, flip);
        await webcam.setup();
        await webcam.play();

        // แสดงกล้อง
        const webcamContainer = document.getElementById("webcam-container");
        webcamContainer.innerHTML = "";
        webcamContainer.appendChild(webcam.canvas);

        // เตรียม predictions container
        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = "";

        for (let i = 0; i < maxPredictions; i++) {
            const div = document.createElement("div");
            div.className = "detection-item";
            div.innerHTML = `
                <span class="detection-name">-</span>
                <span class="detection-percentage">0%</span>
            `;
            labelContainer.appendChild(div);
        }

        updateStatus("ระบบพร้อมใช้งาน", "active");
        isInitialized = true;

        // เริ่ม loop
        window.requestAnimationFrame(loop);

    } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        updateStatus("เกิดข้อผิดพลาด", "error");
    }
}

async function loop() {
    if (!isPaused) {
        webcam.update();
        await predict();
    }
    window.requestAnimationFrame(loop);
}

let lastDetected = "";
let detectionHistory = [];

async function predict() {
    const prediction = await model.predict(webcam.canvas);

    // เรียงลำดับตามความมั่นใจ
    prediction.sort((a, b) => b.probability - a.probability);

    const best = prediction[0];
    const confidence = Math.round(best.probability * 100);

    // เก็บประวัติการตรวจจับ
    detectionHistory.push({
        device: best.className,
        confidence: confidence,
        timestamp: Date.now()
    });

    // เก็บเฉพาะ 10 รายการล่าสุด
    if (detectionHistory.length > 10) {
        detectionHistory.shift();
    }

    // อัพเดท confidence badge
    const confidenceBadge = document.getElementById('confidence-badge');
    confidenceBadge.querySelector('.confidence-value').textContent = confidence;

    // เปลี่ยนสีตามความมั่นใจ
    if (confidence > 80) {
        confidenceBadge.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    } else if (confidence > 60) {
        confidenceBadge.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
    } else {
        confidenceBadge.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    }

    // อัพเดท top prediction
    const topPredictionEl = document.getElementById('top-prediction');
    if (confidence > 50) {
        topPredictionEl.className = 'primary-detection active';
        topPredictionEl.innerHTML = `
            <div class="primary-detection-name">${deviceData[best.className]?.thai || best.className}</div>
            <div class="primary-detection-confidence">${confidence}%</div>
        `;
    } else {
        topPredictionEl.className = 'primary-detection';
        topPredictionEl.innerHTML = `
            <div class="detection-placeholder">
                <i class="fas fa-search"></i>
                <span>รอการตรวจจับ...</span>
            </div>
        `;
    }

    // อัพเดท all predictions
    for (let i = 0; i < Math.min(prediction.length, maxPredictions); i++) {
        const item = labelContainer.childNodes[i];
        const percentage = Math.round(prediction[i].probability * 100);
        const deviceName = deviceData[prediction[i].className]?.thai || prediction[i].className;

        item.querySelector('.detection-name').textContent = deviceName;
        item.querySelector('.detection-percentage').textContent = percentage + '%';

        // ไฮไลท์รายการที่มีความมั่นใจสูง
        if (i === 0 && percentage > 70) {
            item.classList.add('highlight');
        } else {
            item.classList.remove('highlight');
        }
    }

    // แสดงภาพตัวอย่างถ้ามั่นใจมากกว่า 75%
    if (confidence > 75 && lastDetected !== best.className) {
        lastDetected = best.className;
        showDeviceInfo(best.className);
    }
}

function showDeviceInfo(className) {
    const device = deviceData[className];
    if (!device) return;

    const samplePanel = document.getElementById('sample-panel');
    const img = document.getElementById('sample-image');
    const name = document.getElementById('sample-name');
    const description = document.getElementById('sample-description');
    const label = document.getElementById('detected-label');
    const deviceType = document.getElementById('device-type');
    const deviceCategory = document.getElementById('device-category');

    img.src = device.image;
    img.alt = device.thai;
    name.textContent = device.thai;
    description.textContent = device.description;
    label.textContent = device.thai;
    deviceType.textContent = device.type;
    deviceCategory.textContent = device.category;

    samplePanel.style.display = 'block';
    samplePanel.classList.add('fade-in-up');

    // เล่นเสียงแจ้งเตือน (ถ้าต้องการ)
    playDetectionSound();
}

function toggleCamera() {
    isPaused = !isPaused;
    const icon = document.getElementById('camera-toggle-icon');

    if (isPaused) {
        icon.className = 'fas fa-play';
        updateStatus("หยุดชั่วคราว", "paused");
    } else {
        icon.className = 'fas fa-pause';
        updateStatus("ระบบพร้อมใช้งาน", "active");
    }
}

function resetDetection() {
    lastDetected = "";
    detectionHistory = [];
    document.getElementById('sample-panel').style.display = 'none';

    // รีเซ็ต UI
    document.getElementById('top-prediction').innerHTML = `
        <div class="detection-placeholder">
            <i class="fas fa-search"></i>
            <span>รอการตรวจจับ...</span>
        </div>
    `;

    updateStatus("รีเซ็ตเรียบร้อย", "ready");
    setTimeout(() => {
        updateStatus("ระบบพร้อมใช้งาน", "active");
    }, 2000);
}

function updateStatus(message, type) {
    const statusEl = document.getElementById('nav-status');
    const statusText = statusEl.querySelector('.status-text');
    const statusDot = statusEl.querySelector('.status-dot');

    statusText.textContent = message;

    // เปลี่ยนสีตามสถานะ
    const colors = {
        'loading': '#f59e0b',
        'active': '#ef4444',
        'paused': '#6b7280',
        'error': '#ef4444',
        'ready': '#10b981'
    };

    statusDot.style.background = colors[type] || '#10b981';
}

function playDetectionSound() {
    // สร้างเสียงแจ้งเตือนง่ายๆ
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

// เพิ่มการรองรับ keyboard shortcuts
document.addEventListener('keydown', function (event) {
    switch (event.code) {
        case 'Space':
            event.preventDefault();
            if (isInitialized) {
                toggleCamera();
            } else {
                init();
            }
            break;
        case 'KeyR':
            if (event.ctrlKey) {
                event.preventDefault();
                resetDetection();
            }
            break;
    }
});

// เพิ่ม smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// ฟังก์ชันสำหรับแสดงข้อมูลฮาร์ดแวร์
function showHardwareInfo() {
    const infoContent = document.getElementById('info-content');
    infoContent.innerHTML = '';

    hardwareData.forEach(hardware => {
        const div = document.createElement('div');
        div.className = 'hardware-card';
        div.innerHTML = `
            <img src="${hardware.image}" alt="${hardware.name}">
            <div class="hardware-info">
                <h3>${hardware.name}</h3>
                <p>${hardware.description}</p>
                <button class="details-btn" onclick="showDetails(${hardware.id})">ดูรายละเอียด</button>
            </div>
        `;
        infoContent.appendChild(div);
    });
}

// เรียกใช้ฟังก์ชันแสดงข้อมูลฮาร์ดแวร์เมื่อโหลดหน้า
window.onload = () => {
    showHardwareInfo();
};

// ค้นหาอุปกรณ์
document.getElementById('search').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const allCards = document.querySelectorAll('.hardware-card');

    allCards.forEach(card => {
        const text = card.innerText.toLowerCase();
        if (text.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});
