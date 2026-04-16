// ===== PadhoIndia Prototype - Complete JavaScript =====

// 1) Tailwind config (in <head>)
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: { sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'] },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 3s infinite',
            }
        }
    }
};

// 2) Main App Logic
document.addEventListener('DOMContentLoaded', () => {
    // Theme - persists like Unacademy
    const root = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const saved = localStorage.getItem('pi-theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) root.classList.add('dark');
    themeToggle.onclick = () => {
        root.classList.toggle('dark');
        localStorage.setItem('pi-theme', root.classList.contains('dark')? 'dark' : 'light');
    };

    // Courses Data - modeled on PW/Unacademy
    const courses = [
        { id:1, title:"JEE Ultimate Crash 2026 - Physics", instructor:"Amit Verma Sir", cat:"JEE", price:2999, rating:4.8, lang:"Hinglish", progress:34, color:"from-orange-500 to-pink-600", students:"42k" },
        { id:2, title:"NEET MahaRevision - Biology", instructor:"Dr. Ritu Singh", cat:"NEET", price:3499, rating:4.9, lang:"Hinglish", progress:12, color:"from-emerald-500 to-teal-600", students:"58k" },
        { id:3, title:"UPSC Prelims Test Series 2026", instructor:"Rajesh Patel", cat:"UPSC", price:4999, rating:4.7, lang:"Hindi", progress:0, color:"from-indigo-500 to-violet-600", students:"21k" },
        { id:4, title:"SSC CGL Foundation Batch", instructor:"Vikram Sharma", cat:"SSC", price:1999, rating:4.6, lang:"Hinglish", progress:56, color:"from-blue-500 to-cyan-600", students:"33k" },
        { id:5, title:"GATE CSE 2026 - Crash", instructor:"Arjun Mehta", cat:"GATE", price:5999, rating:4.8, lang:"English", progress:0, color:"from-slate-700 to-slate-900", students:"9k" },
        { id:6, title:"Class 10 Science - NCERT Line by Line", instructor:"Pooja Mam", cat:"Class 6-12", price:1499, rating:4.9, lang:"Hinglish", progress:78, color:"from-fuchsia-500 to-purple-600", students:"74k" },
    ];

    const grid = document.getElementById('courseGrid');
    function renderCourses(list){
        grid.innerHTML = list.map(c => `
        <div class="course-card group relative overflow-hidden rounded-[22px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1421] shadow-sm hover:shadow-xl hover:-translate-y-1 transition cursor-pointer" data-title="${c.title.toLowerCase()}" data-cat="${c.cat}" onclick="openModal('${c.title}')">
            <div class="h-[152px] relative bg-gradient-to-br ${c.color} p-5">
                <div class="absolute inset-0 opacity-[0.15]" style="background-image: radial-gradient(white 1px, transparent 1px); background-size: 16px 16px;"></div>
                <div class="relative z-10 flex items-start justify-between">
                    <span class="px-2.5 py-1 rounded-lg bg-black/20 backdrop-blur text-white text-[11px] font-medium">${c.cat}</span>
                    <span class="px-2 py-1 rounded-lg bg-white/90 text-slate-900 text-[11px] font-bold">★ ${c.rating}</span>
                </div>
                <div class="relative z-10 mt-10">
                    <div class="w-10 h-10 rounded-xl bg-white/15 backdrop-blur grid place-items-center border border-white/20">
                        <svg width="20" height="20" viewBox="0 24 24" fill="none" class="text-white"><path d="M8 5v14l11-7-11-7z" fill="currentColor"/></svg>
                    </div>
                </div>
            </div>
            <div class="p-4">
                <h3 class="font-semibold leading-snug line-clamp-2 min-h-[44px]">${c.title}</h3>
                <div class="mt-1.5 flex items-center gap-2 text-[12px] text-slate-500"><span>${c.instructor}</span><span>•</span><span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10">${c.lang}</span></div>
                <div class="mt-3 flex items-center justify-between">
                    <div><span class="text-[18px] font-extrabold">₹${c.price.toLocaleString('en-IN')}</span><span class="ml-1 text-[11px] text-slate-500 line-through">₹${Math.round(c.price*1.6).toLocaleString('en-IN')}</span></div>
                    <span class="text-[11px] text-slate-500">${c.students} students</span>
                </div>
                <div class="mt-3">
                    <div class="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full" style="width:${c.progress}%"></div></div>
                    <div class="mt-1.5 flex items-center justify-between">
                        <span class="text-[11px] text-slate-500">${c.progress>0?c.progress+'% complete':'Start learning'}</span>
                        <button class="enrollBtn h-8 px-3 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-90 transition" data-id="${c.id}" onclick="event.stopPropagation(); enroll(this)">Enroll</button>
                    </div>
                </div>
            </div>
        </div>`).join('');
    }
    renderCourses(courses);

    // Search - desktop and mobile
    const searchInputs = [document.getElementById('searchInput'), document.getElementById('searchInputMobile')].filter(Boolean);
    searchInputs.forEach(inp => inp.addEventListener('input', e => {
        const q = e.target.value.toLowerCase();
        const filtered = courses.filter(c => c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q));
        renderCourses(filtered);
        filterByCategory(document.querySelector('.cat-chip.active')?.dataset.cat || 'all', false);
    }));

    // Category filter
    document.querySelectorAll('.cat-chip').forEach(btn => btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-chip').forEach(b => b.classList.remove('active','bg-slate-900','dark:bg-white','text-white','dark:text-black'));
        btn.classList.add('active','bg-slate-900','dark:bg-white','text-white','dark:text-black');
        filterByCategory(btn.dataset.cat, true);
    }));
    function filterByCategory(cat, fromClick){
        document.querySelectorAll('.course-card').forEach(card => {
            const show = cat==='all' || card.dataset.cat===cat;
            card.style.display = show? '' : 'none';
        });
    }

    // Live timers - updates every second
    function updateTimers(){
        document.querySelectorAll('.live-timer').forEach(el => {
            let s = parseInt(el.dataset.start,10);
            if (s <= 0) { el.textContent = 'LIVE NOW'; el.className = 'live-timer px-2.5 py-1 rounded-full bg-red-500 text-white text-[11px] font-bold'; return; }
            s--; el.dataset.start = s;
            const m = Math.floor(s/60), sec = s%60;
            el.textContent = m>0? `Starts in ${m}m` : `Starts in ${sec}s`;
        });
    }
    setInterval(updateTimers,1000);

    // Enroll - mimics PW's "My Batches"
    let myCount = 0;
    window.enroll = function(btn){
        if(btn.dataset.enrolled==='1') return;
        btn.dataset.enrolled='1';
        btn.textContent='Enrolled ✓';
        btn.classList.add('opacity-70','cursor-default');
        myCount++; document.getElementById('myCoursesCount').textContent = myCount;
        btn.closest('.course-card').querySelector('.h-1\\.5 div').style.width='5%';
    }

    // Modal - video classroom
    const modal = document.getElementById('videoModal');
    window.openModal = function(title){
        document.getElementById('modalTitle').textContent = title;
        modal.classList.remove('hidden');
        document.body.style.overflow='hidden';
    }
    window.closeModal = function(){
        modal.classList.add('hidden');
        document.body.style.overflow='';
        document.getElementById('previewVideo').pause();
    }

    // Tabs - Notes/DPPs/Doubts
    document.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active','bg-white/10'));
        b.classList.add('active','bg-white/10');
        document.querySelectorAll('.tab-pane').forEach(p=>p.classList.add('hidden'));
        document.getElementById('tab-'+b.dataset.tab).classList.remove('hidden');
    }));

    // Quiz - instant scoring like PW DPPs
    const quizData = [
        { q:"∫ x·e^x dx =?", opts:["e^x(x-1)+C","e^x(x+1)+C","x e^x + C","e^x + C"], ans:0 },
        { q:"Photosynthesis mein O2 kahan se aata hai?", opts:["CO2","H2O","Glucose","Air"], ans:1 },
        { q:"1857 revolt ka immediate cause?", opts:["Doctrine of Lapse","Enfield rifle cartridge","Partition","Simon"], ans:1 },
    ];
    const quizBox = document.getElementById('quizBox');
    quizBox.innerHTML = quizData.map((qq,i)=>`
        <div class="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <div class="text-[13px] font-medium">${i+1}. ${qq.q}</div>
            <div class="mt-2 grid grid-cols-1 gap-1.5">
                ${qq.opts.map((o,oi)=>`<label class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white dark:hover:bg-white/5 cursor-pointer text-[13px]"><input type="radio" name="q${i}" value="${oi}" class="accent-violet-600"><span>${o}</span></label>`).join('')}
            </div>
        </div>
    `).join('');
    document.getElementById('quizSubmit').onclick = () => {
        let score=0;
        quizData.forEach((qq,i)=>{
            const sel=document.querySelector(`input[name="q${i}"]:checked`);
            if(sel && +sel.value===qq.ans) score++;
        });
        const res = document.getElementById('quizResult');
        res.classList.remove('hidden');
        res.textContent = `Aapka score: ${score}/3 — ${score===3?'Topper! 🔥': score>=2?'Bahut badhiya!':'Practice aur karo 💪'}`;
    };

    // Pricing toggle - monthly/yearly like PW
    const monthlyBtn = document.getElementById('billMonthly');
    const yearlyBtn = document.getElementById('billYearly');
    function setBilling(yearly){
        document.querySelectorAll('.price').forEach(p=>{
            p.textContent = yearly? p.dataset.y : p.dataset.m;
        });
        monthlyBtn.classList.toggle('bg-white',!yearly);
        monthlyBtn.classList.toggle('dark:bg-white/10',!yearly);
        monthlyBtn.classList.toggle('shadow-sm',!yearly);
        yearlyBtn.classList.toggle('bg-white',yearly);
        yearlyBtn.classList.toggle('dark:bg-white/10',yearly);
        yearlyBtn.classList.toggle('shadow-sm',yearly);
    }
    monthlyBtn.onclick = ()=> setBilling(false);
    yearlyBtn.onclick = ()=> setBilling(true);
    setBilling(true);
});