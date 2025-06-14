// filepath: c:\Users\User\Desktop\hardware\detect.js
document.addEventListener('DOMContentLoaded', () => {
    initDetection();
});

const URL = "./my_model/";  // แก้ไขพาธให้ถูกต้อง
let model, webcam, labelContainer, maxPredictions;

// ข้อมูลอุปกรณ์
const hardwareInfo = {
    "Cables": {
        name: "สายเคเบิล",
        image: "images/cables.jpg",
        description: "สายสัญญาณสำหรับเชื่อมต่ออุปกรณ์คอมพิวเตอร์"
    },
    "Case": {
        name: "เคสคอมพิวเตอร์",
        image: "images/case.jpg",
        description: "ตู้สำหรับใส่อุปกรณ์คอมพิวเตอร์"
    },
    "CPU": {
        name: "หน่วยประมวลผลกลาง",
        image: "images/cpu.jpg",
        description: "สมองของคอมพิวเตอร์ ทำหน้าที่ประมวลผลข้อมูล"
    },
    "GPU": {
        name: "การ์ดแสดงผล",
        image: "images/gpu.jpg",
        description: "อุปกรณ์ประมวลผลด้านกราฟิก"
    },
    "HDD": {
        name: "ฮาร์ดดิสก์",
        image: "images/hdd.jpg",
        description: "อุปกรณ์เก็บข้อมูลถาวร"
    },
    "Headset": {
        name: "หูฟัง",
        image: "images/headset.jpg",
        description: "อุปกรณ์สำหรับฟังเสียงและพูดคุย"
    },
    "Keyboard": {
        name: "แป้นพิมพ์",
        image: "images/keyboard.jpg",
        description: "อุปกรณ์สำหรับป้อนข้อมูลตัวอักษร"
    },
    "Monitor": {
        name: "จอภาพ",
        image: "images/monitor.jpg",
        description: "อุปกรณ์แสดงผลภาพ"
    },
    "Motherboard": {
        name: "เมนบอร์ด",
        image: "images/motherboard.jpg",
        description: "แผงวงจรหลักที่เชื่อมต่ออุปกรณ์ทั้งหมด"
    },
    "Mouse": {
        name: "เมาส์",
        image: "images/mouse.jpg",
        description: "อุปกรณ์ชี้ตำแหน่งและควบคุม"
    },
    "RAM": {
        name: "หน่วยความจำ",
        image: "images/ram.jpg",
        description: "หน่วยความจำชั่วคราวสำหรับการทำงาน"
    }
};

async function initDetection() {
    try {
        // แสดงสถานะกำลังโหลด
        updateStatus("กำลังโหลดโมเดล...", "loading");
        console.log("Loading model...");

        // โหลดโมเดล
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        
        console.log("Model URL:", modelURL);
        console.log("Metadata URL:", metadataURL);

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        
        console.log("Model loaded successfully");
        console.log("Number of classes:", maxPredictions);

        // ตั้งค่ากล้อง
        const flip = true;
        webcam = new tmImage.Webcam(400, 400, flip);
        
        try {
            await webcam.setup();
            await webcam.play();
            console.log("Webcam initialized");
        } catch (error) {
            console.error("Webcam error:", error);
            updateStatus("ไม่สามารถเข้าถึงกล้องได้", "error");
            return;
        }

        // แสดงภาพจากกล้อง
        const webcamContainer = document.getElementById("webcam-container");
        webcamContainer.innerHTML = '';
        webcamContainer.appendChild(webcam.canvas);

        // เตรียมพื้นที่แสดงผล
        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = '';
        
        // เริ่มการทำนาย
        updateStatus("กำลังตรวจจับ...", "active");
        window.requestAnimationFrame(loop);

    } catch (error) {
        console.error("Initialization error:", error);
        updateStatus("ไม่สามารถโหลดโมเดลได้", "error");
    }
}

async function loop() {
    if (webcam && webcam.canvas) {
        webcam.update();
        await predict();
        window.requestAnimationFrame(loop);
    }
}

// แก้ไขฟังก์ชัน predict
async function predict() {
    try {
        if (!model || !webcam) return;

        const prediction = await model.predict(webcam.canvas);
        let bestPrediction = prediction[0];

        // หาผลการทำนายที่ดีที่สุด
        for (let i = 0; i < maxPredictions; i++) {
            if (prediction[i].probability > bestPrediction.probability) {
                bestPrediction = prediction[i];
            }
        }

        // อัพเดทการแสดงผลหลัก
        const mainAccuracy = document.getElementById('main-accuracy');
        const mainLabel = document.getElementById('main-label');
        const accuracy = (bestPrediction.probability * 100).toFixed(1);
        
        // ใช้ชื่อภาษาไทยจาก hardwareInfo
        const hardwareData = hardwareInfo[bestPrediction.className];
        if (hardwareData) {
            mainLabel.textContent = hardwareData.name;
            
            // แสดง sample card ถ้าความแม่นยำมากกว่า 70%
            if (bestPrediction.probability > 0.7) {
                showSampleCard(bestPrediction.className);
            }
        } else {
            mainLabel.textContent = bestPrediction.className;
        }
        
        mainAccuracy.textContent = `${accuracy}%`;

        // แสดงผลทั้งหมด
        labelContainer.innerHTML = '';
        for (let i = 0; i < maxPredictions; i++) {
            const probability = (prediction[i].probability * 100).toFixed(1);
            const hardware = hardwareInfo[prediction[i].className];
            const displayName = hardware ? hardware.name : prediction[i].className;
            
            const div = document.createElement("div");
            div.className = "prediction-item";
            div.innerHTML = `
                <div class="prediction-bar" style="width: ${probability}%"></div>
                <span class="prediction-label">${displayName}</span>
                <span class="prediction-score">${probability}%</span>
            `;
            labelContainer.appendChild(div);
        }

    } catch (error) {
        console.error("Prediction error:", error);
        updateStatus("เกิดข้อผิดพลาดในการตรวจจับ", "error");
    }
}

function showSampleCard(className) {
    const hardware = hardwareInfo[className];
    if (!hardware) return;

    const sampleCard = document.getElementById("sample-card");
    const sampleImage = document.getElementById("sample-image");
    const detectedItem = document.getElementById("detected-item");
    const itemDescription = document.getElementById("item-description");

    sampleImage.src = hardware.image;
    detectedItem.textContent = hardware.name;
    itemDescription.textContent = hardware.description;
    sampleCard.style.display = "block";
}

function updateStatus(message, state) {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    
    statusText.textContent = message;
    
    switch (state) {
        case 'loading':
            statusDot.style.backgroundColor = '#FCD34D';
            break;
        case 'ready':
            statusDot.style.backgroundColor = '#34D399';
            break;
        case 'error':
            statusDot.style.backgroundColor = '#EF4444';
            break;
    }
}