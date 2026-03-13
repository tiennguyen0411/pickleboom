import { useState, useMemo, useEffect, useCallback } from "react";

const TIER_COLORS = {
  "1+":"#FF6B35","1-":"#FF8C5A","2++":"#FFB347","2+":"#FFC87A",
  "2":"#6B7280","2-":"#9CA3AF","3+":"#D1D5DB","3":"#E5E7EB",
};
const TIER_BOOM = {
  "1+":2.8,"1-":2.75,"2++":2.7,"2+":2.65,"2":2.1,"2-":2.05,"3+":2.55,"3":2.5,
};
const TIERS = ["1+","1-","2++","2+","2","2-","3+","3"];
const ADMIN_CREDENTIALS = [
  {username:"admin",    password:"pickleboom@2026", label:"Administrator", role:"admin"},
  {username:"hahoang",  password:"mod@hahoang",     label:"Ha Hoang",      role:"mod"},
  {username:"viettan",  password:"mod@viettan",     label:"Viết Tân",      role:"mod"},
];

const ROLE_PERMISSIONS = {
  admin: {
    label:"Administrator",
    color:"#FF6B35",
    badge:"👑 Admin",
    canEditPlayers: true,
    canDeletePlayers: true,
    canAddPlayers: true,
    canAdjustScore: true,
    canCreateTournament: true,
    canManageTournament: true,
    canApproveReg: true,
    canApproveTourReg: true,
    canResetData: true,
    canManageRoles: true,
  },
  mod: {
    label:"Moderator",
    color:"#60A5FA",
    badge:"🛡 Mod",
    canEditPlayers: true,
    canDeletePlayers: true,
    canAddPlayers: true,
    canAdjustScore: true,
    canCreateTournament: true,
    canManageTournament: true,
    canApproveReg: true,
    canApproveTourReg: true,
    canResetData: false,
    canManageRoles: false,
  },
};

const INIT = {
  male:[
    {id:1,name:"Huy Phạm ",tier:"1+",boom:2.83,remark:"Á quân pvna 5.2 Quảng Ngãi 8/3"},
    {id:2,name:"A Hòa ",tier:"1+",boom:2.83,remark:"+0.03 Á Quân WeekBoom1 21/01"},
    {id:3,name:"Phong ",tier:"1+",boom:2.85,remark:"+0.05 Vô địch WeekBoom2 31/01"},
    {id:4,name:"Tân Liver ",tier:"1-",boom:2.8,remark:"+0.05 Vô địch WeekBoom1 21/01"},
    {id:5,name:"Vũ Luân ",tier:"1-",boom:2.75},
    {id:6,name:"Viết Tân",tier:"1-",boom:2.75},
    {id:7,name:"Quảng Chế",tier:"2++",boom:2.73,remark:"Á Quân pvna fpt 8/3"},
    {id:8,name:"Hiếu Trần",tier:"2++",boom:2.7},
    {id:9,name:"Quí Nguyễn",tier:"2++",boom:2.7},
    {id:10,name:"Ha Hoang",tier:"2++",boom:2.7},
    {id:11,name:"Tiến Nguyễn",tier:"2+",boom:2.65},
    {id:12,name:"Dương Mỹ",tier:"2+",boom:2.65},
    {id:13,name:"A Dũng Newlife",tier:"2+",boom:2.65},
    {id:14,name:"Nghĩa",tier:"2+",boom:2.65},
    {id:15,name:"Minh Trần",tier:"2+",boom:2.68,remark:"+0.03 Á Quân WeekBoom2 31/01"},
    {id:16,name:"Tan Thuan",tier:"2+",boom:2.65},
    {id:17,name:"Hùng Cận",tier:"2+",boom:2.65},
    {id:18,name:"Rin",tier:"2+",boom:2.65},
    {id:19,name:"Bin BIn",tier:"2+",boom:2.65},
    {id:20,name:"Tư Khoa",tier:"2-",boom:2.63,remark:"+0.03 Á Quân WeekBoom2 31/01"},
    {id:21,name:"Tuấn Nguyên",tier:"2-",boom:2.6},
    {id:22,name:"An gs",tier:"2-",boom:2.6},
    {id:23,name:"Đình Chung",tier:"2-",boom:2.6},
    {id:24,name:"Mạnh Hoàng",tier:"2-",boom:2.6},
    {id:25,name:"Hưng",tier:"3+",boom:2.55},
    {id:26,name:"Quốc Đạt",tier:"3+",boom:2.55},
    {id:27,name:"Luân Ng",tier:"3+",boom:2.55},
    {id:28,name:"Huy PHan",tier:"3+",boom:2.55},
    {id:29,name:"A Toàn",tier:"3+",boom:2.55},
    {id:30,name:"Trần Anh Đức",tier:"3+",boom:2.58,remark:"+0.03 Vô địch giải nội bộ ngành du lịch 15/01"},
    {id:31,name:"Nhan Tam",tier:"3+",boom:2.55},
    {id:32,name:"Phúc",tier:"3",boom:2.5},
    {id:33,name:"Vĩnh",tier:"3",boom:2.5},
    {id:34,name:"Xưng",tier:"3",boom:2.5},
    {id:35,name:"WIN",tier:"3",boom:2.5},
    {id:36,name:"Huy Oto",tier:"3",boom:2.5},
    {id:37,name:"Tứ Linh",tier:"3",boom:2.5},
    {id:38,name:"Hùng AAC",tier:"3",boom:2.5},
    {id:39,name:"Linh Huỳnh",tier:"3",boom:2.5},
    {id:40,name:"Trương Hùng",tier:"3",boom:2.5},
    {id:41,name:"Tuấn Mai",tier:"3",boom:2.745,remark:"Tham gia mini game 21/01 . Snapshot 15/01"},
    {id:42,name:"Thanh Tuấn",tier:"3",boom:2.6,remark:"Mini game 21/01 . Snapshot 18/01 tickvang"},
    {id:43,name:"Duy Anh",tier:"3",boom:2.95},
  ],
  female:[
    {id:101,name:"Như Hiếu",tier:"1+",boom:2.15},
    {id:102,name:"Giao",tier:"1+",boom:2.19,remark:"+0.04 Vô địch WeekBoom2 31/01"},
    {id:103,name:"Hiếu tay trái",tier:"1+",boom:2.15},
    {id:104,name:"Phương Thảo",tier:"1+",boom:2.15},
    {id:105,name:"Nga",tier:"1+",boom:2.15},
    {id:106,name:"Linh Thái",tier:"1+",boom:2.15},
    {id:107,name:"Dương",tier:"2",boom:2.1},
    {id:108,name:"Diệu",tier:"2",boom:2.1},
    {id:109,name:"Phương Cici",tier:"2",boom:2.14,remark:"+0.04 Vô địch WeekBoom1 21/01"},
    {id:110,name:"Hải",tier:"2",boom:2.1},
    {id:111,name:"Hằng",tier:"2",boom:2.1},
    {id:112,name:"Mai",tier:"2",boom:2.1},
    {id:113,name:"Milo",tier:"2",boom:2.1},
    {id:114,name:"C Yến K",tier:"2",boom:2.1},
    {id:115,name:"Song Hà",tier:"2",boom:2.1},
    {id:116,name:"Vũ Thảo",tier:"2",boom:2.1},
    {id:117,name:"Hằng niu",tier:"2",boom:2.1},
    {id:118,name:"Tú",tier:"2",boom:2.1},
    {id:119,name:"Hương",tier:"2",boom:2.1},
    {id:120,name:"Ái",tier:"2-",boom:2.05},
    {id:121,name:"Thu Hà",tier:"2-",boom:2.05},
    {id:122,name:"Nguyên",tier:"2-",boom:2.05},
    {id:123,name:"C Bi",tier:"2-",boom:2.05},
    {id:124,name:"Thảo nhỏ",tier:"2-",boom:2.07,remark:"+0.02 Á Quân WeekBoom1 21/01"},
    {id:125,name:"Lam Bình",tier:"2-",boom:2.05},
    {id:126,name:"Anber",tier:"2-",boom:2.05},
    {id:127,name:"Trang Đỗ",tier:"2-",boom:2.05},
    {id:128,name:"Quỳnh Anh",tier:"2-",boom:2.05},
    {id:129,name:"Thùy Huỳnh",tier:"2",boom:2.1,remark:"Mini game 21/01 . Snapshot 18/01 tickvang"},
  ],
};

const C = {
  orange:"#FF6B35",orange2:"#FF8C5A",bg:"#111",bg2:"#181818",bg3:"#222",
  border:"rgba(255,107,53,0.2)",text:"#E5E7EB",muted:"#9CA3AF",dim:"#4B5563",
};

function TierChip({tier}){
  return <span style={{fontSize:10,padding:"2px 7px",borderRadius:20,fontWeight:800,border:"1px solid "+TIER_COLORS[tier]+"55",background:TIER_COLORS[tier]+"18",color:TIER_COLORS[tier],flexShrink:0}}>{tier}</span>;
}
function BoomBadge({boom,tier}){
  return <span style={{padding:"3px 10px",borderRadius:20,fontSize:13,fontWeight:800,color:TIER_COLORS[tier],background:TIER_COLORS[tier]+"1a",border:"1px solid "+TIER_COLORS[tier]+"33"}}>{boom.toFixed(2)}</span>;
}
function Card({children,style={}}){
  return <div style={{background:"rgba(255,255,255,0.028)",border:"1px solid "+C.border,borderRadius:18,padding:16,...style}}>{children}</div>;
}
function SectionTitle({children}){
  return <div style={{fontSize:13,fontWeight:700,color:C.orange,marginBottom:12,letterSpacing:0.5,textTransform:"uppercase"}}>{children}</div>;
}

const MS = {
  width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,107,53,0.25)",
  borderRadius:10,padding:"11px 14px",color:"#E5E7EB",fontSize:16,outline:"none",boxSizing:"border-box",
};

const SB_URL = "https://oevgauxkildxdrqnphnw.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ldmdhdXhraWxkeGRycW5waG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMzYzOTUsImV4cCI6MjA4ODcxMjM5NX0.SMw09iIB6-3kaEjzXrxF7tP8DsN375linNZPxX1B2kc";

const sbFetch = async (path, options={}) => {
  const {headers: optHeaders={}, ...restOptions} = options;
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    ...restOptions,
    headers: {
      "apikey": SB_KEY,
      "Authorization": `Bearer ${SB_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
      ...optHeaders,
    },
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`[sbFetch] ${options.method||"GET"} ${path} → ${res.status}:`, err);
    throw new Error(err);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

const rowToPlayer = (r) => ({
  id: r.id,
  name: r.name,
  tier: r.tier,
  boom: r.boom,
  gender: r.gender,
  remark: r.remark || "",
  phone: r.phone || "",
});

const rowsToPlayers = (rows) => {
  const male = rows.filter(r=>r.gender==="male").map(rowToPlayer);
  const female = rows.filter(r=>r.gender==="female").map(rowToPlayer);
  return { male, female };
};

export default function App(){
  const [tab,setTab]=useState("dashboard");
  const [players,setPlayers]=useState(INIT);
  const [search,setSearch]=useState("");
  const [filterTier,setFilterTier]=useState("all");
  const [filterGender,setFilterGender]=useState("all");
  const [showAddModal,setShowAddModal]=useState(false);
  const [adjModal,setAdjModal]=useState(null);
  const [newPlayer,setNewPlayer]=useState({name:"",tier:"3",gender:"male",remark:"",phone:""});
  const [adjForm,setAdjForm]=useState({type:"",value:0,note:""});
  const [editModal,setEditModal]=useState(null);
  const [editForm,setEditForm]=useState({name:"",tier:"3",gender:"male",remark:"",phone:""});
  const [deleteConfirm,setDeleteConfirm]=useState(null);
  const [history,setHistory]=useState([]);
  const [notif,setNotif]=useState(null);
  const [auth,setAuth]=useState(()=>{
    try {
      const saved = sessionStorage.getItem("pb_auth");
      if(saved){
        const {loggedIn,user} = JSON.parse(saved);
        if(loggedIn && user) return {loggedIn:true,user,showLogin:false,u:"",p:"",err:""};
      }
    } catch(e){}
    return {loggedIn:false,user:null,showLogin:false,u:"",p:"",err:""};
  });
  const [rankGender,setRankGender]=useState("male");
  const [dbReady,setDbReady]=useState(false);
  const [syncing,setSyncing]=useState(false);
  const [regForm,setRegForm]=useState({name:"",email:"",pvna:"",gender:"male",phone:"",note:""});
  const [regList,setRegList]=useState([]);
  const [regSubmitted,setRegSubmitted]=useState(false);
  const [regLoading,setRegLoading]=useState(false);
  const [showRegModal,setShowRegModal]=useState(false);
  const [tournaments,setTournaments]=useState([]);
  const [showTourModal,setShowTourModal]=useState(false);
  const [editTourModal,setEditTourModal]=useState(null); // tour being edited
  const [tourForm,setTourForm]=useState({name:"",date:"",format:"double",rounds:"1",note:"",pin:"",bestOf:"3"});
  const [activeTour,setActiveTour]=useState(null);
  const [showMatchModal,setShowMatchModal]=useState(false);
  const [matchForm,setMatchForm]=useState({p1:"",p2:"",p3:"",p4:"",score1:"",score2:"",round:"1"});
  const [viewTour,setViewTour]=useState(null);
  const [playerHistoryView,setPlayerHistoryView]=useState(null);
  const [mmSel,setMmSel]=useState([]);
  const [mmResult,setMmResult]=useState(null);
  const [tourRegForm,setTourRegForm]=useState({tourId:"",playerName:"",contact:"",content:"single",partner:"",note:""});
  const [showTourRegForm,setShowTourRegForm]=useState(null); // tour object for public registration modal
  const [tourRegSubmitted,setTourRegSubmitted]=useState(false);
  const [playerSearch,setPlayerSearch]=useState("");
  const [showPlayerPicker,setShowPlayerPicker]=useState(false);
  const [pickerTarget,setPickerTarget]=useState("playerName");
  const [regPlayerFocus,setRegPlayerFocus]=useState(false);
  const [regPartnerFocus,setRegPartnerFocus]=useState(false);
  const [showTourRegAdmin,setShowTourRegAdmin]=useState(null); // tourId being managed
  const [tourRegAdminTab,setTourRegAdminTab]=useState("pending");
  const [refMode,setRefMode]=useState(false); // fullscreen referee UI
  const [refPin,setRefPin]=useState("");
  const [refPinInput,setRefPinInput]=useState("");
  const [refPinErr,setRefPinErr]=useState("");
  const [refTour,setRefTour]=useState(null); // tournament unlocked by PIN
  const [refMatch,setRefMatch]=useState(null); // match being scored {id,team1,team2,round,format}
  const [refGames,setRefGames]=useState([]); // [{g1t1,g1t2},{g2t1,g2t2},...] each game score
  const [refConfirmed,setRefConfirmed]=useState(false);
  const [showGroupDrawModal,setShowGroupDrawModal]=useState(null); // tour object
  const [groupConfig,setGroupConfig]=useState({numGroups:2,seedBy:"tier",players:[]});

  const loadFromDB = async () => {
    setSyncing(true);
    try {
      const [pRows, hRows, rRows, tRows] = await Promise.all([
        sbFetch("players?select=*&order=id.asc"),
        sbFetch("history?select=*&order=created_at.desc&limit=100"),
        sbFetch("registrations?select=*&order=id.desc&limit=200"),
        sbFetch("tournaments?select=*&order=id.desc&limit=100"),
      ]);
      if (pRows && pRows.length > 0) {
        setPlayers(rowsToPlayers(pRows));
      } else {
        console.warn("[load] players empty, skipping auto-seed to prevent 401");
      }
      if (Array.isArray(hRows)) {
        setHistory(hRows.map(r=>({id:r.id,action:r.action,player:r.player,detail:r.detail||"",time:r.time||""})));
      }
      if (Array.isArray(rRows)) setRegList(rRows);
      if (Array.isArray(tRows) && tRows.length >= 0) {
        const tours = tRows.map(t=>({
          ...t,
          matches: typeof t.matches==="string" ? JSON.parse(t.matches||"[]") : (t.matches||[]),
          tourRegs: typeof t.tour_regs==="string" ? JSON.parse(t.tour_regs||"[]") : (t.tour_regs||[]),
          groups: typeof t.groups==="string" ? JSON.parse(t.groups||"[]") : (t.groups||[]),
        }));
        setTournaments(tours);
      }
      setDbReady(true);
      showNotif("Đã tải dữ liệu từ server");
    } catch(e) {
      console.error("Supabase load error:", e);
      showNotif("Lỗi kết nối server","err");
      setDbReady(true);
    }
    setSyncing(false);
  };

  useEffect(()=>{ loadFromDB(); }, []);

  const seedDatabase = async () => {
    const allInit = [
      ...INIT.male.map(p=>({id:p.id,name:p.name,tier:p.tier,boom:p.boom,gender:"male",remark:p.remark||""})),
      ...INIT.female.map(p=>({id:p.id,name:p.name,tier:p.tier,boom:p.boom,gender:"female",remark:p.remark||""})),
    ];
    await sbFetch("players", {
      method:"POST",
      headers:{"Prefer":"return=minimal"},
      body: JSON.stringify(allInit),
    });
  };

  const allPlayers=useMemo(()=>[
    ...players.male.map(p=>({...p,gender:"male"})),
    ...players.female.map(p=>({...p,gender:"female"})),
  ],[players]);

  const filtered=useMemo(()=>allPlayers.filter(p=>{
    const ms=p.name.toLowerCase().includes(search.toLowerCase());
    const mt=filterTier==="all"||p.tier===filterTier;
    const mg=filterGender==="all"||p.gender===filterGender;
    return ms&&mt&&mg;
  }),[allPlayers,search,filterTier,filterGender]);

  const stats=useMemo(()=>{
    const tc={};
    allPlayers.forEach(p=>{tc[p.tier]=(tc[p.tier]||0)+1;});
    return{total:allPlayers.length,male:players.male.length,female:players.female.length,tc,avg:(allPlayers.reduce((s,p)=>s+p.boom,0)/allPlayers.length).toFixed(2)};
  },[allPlayers,players]);

  const topMale=useMemo(()=>[...players.male].sort((a,b)=>b.boom-a.boom).slice(0,5),[players]);
  const topFemale=useMemo(()=>[...players.female].sort((a,b)=>b.boom-a.boom).slice(0,5),[players]);

  const isAdmin=auth.loggedIn;
  const userRole = auth.user?.role || null;
  const perms = userRole ? ROLE_PERMISSIONS[userRole] : {};
  const can = (perm) => !!perms[perm];

  const showNotif=(msg,type="ok")=>{
    setNotif({msg,type});
    setTimeout(()=>setNotif(null),3000);
  };

  const addHistory = async (action, player, detail) => {
    const entry = {id:Date.now(),action,player,detail,time:new Date().toLocaleString("vi-VN")};
    setHistory(h=>[entry,...h]);
    try {
      await sbFetch("history", {
        method:"POST",
        body: JSON.stringify({id:entry.id,action,player,detail,time:entry.time}),
      });
    } catch(e){ console.error("history write:", e); }
  };

  const handleLogin=()=>{
    const found=ADMIN_CREDENTIALS.find(c=>c.username===auth.u&&c.password===auth.p);
    if(found){
      sessionStorage.setItem("pb_auth", JSON.stringify({loggedIn:true,user:found}));
      setAuth(a=>({...a,loggedIn:true,user:found,showLogin:false,err:"",u:"",p:""}));
      showNotif("Đăng nhập thành công");
    }
    else setAuth(a=>({...a,err:"Sai tên đăng nhập hoặc mật khẩu"}));
  };
  const handleLogout=()=>{sessionStorage.removeItem("pb_auth");setAuth({loggedIn:false,user:null,showLogin:false,u:"",p:"",err:""});if(["roles"].includes(tab))setTab("dashboard");showNotif("Đã đăng xuất");};

  const handleRegister=async()=>{
    if(!regForm.name.trim()||!regForm.phone.trim())return;
    const phone=regForm.phone.trim();
    const dupPlayer=allPlayers.find(p=>p.phone&&p.phone===phone);
    if(dupPlayer){showNotif("SĐT đã đăng ký: "+dupPlayer.name,"err");setRegLoading(false);return;}
    const dupReg=regList.find(r=>r.phone&&r.phone===phone&&r.status==="pending");
    if(dupReg){showNotif("SĐT đang chờ duyệt ("+dupReg.name+")","err");setRegLoading(false);return;}
    setRegLoading(true);
    const entry={id:Date.now(),name:regForm.name.trim(),phone,email:regForm.email.trim(),pvna:regForm.pvna.trim(),gender:regForm.gender,note:regForm.note.trim(),time:new Date().toLocaleString("vi-VN"),status:"pending"};
    setRegList(prev=>[entry,...prev]);
    try{await sbFetch("registrations",{method:"POST",headers:{"Prefer":"return=minimal"},body:JSON.stringify(entry)});}catch(e){console.error("reg:",e);}
    setRegSubmitted(true);
    setRegLoading(false);
    setRegForm({name:"",email:"",pvna:"",gender:"male",phone:"",note:""});
  };

  const handleApproveReg=async(reg)=>{
    setRegList(prev=>prev.map(r=>r.id===reg.id?{...r,status:"approved"}:r));
    if(reg.phone){
      const matched=allPlayers.find(p=>p.name.trim().toLowerCase()===reg.name.trim().toLowerCase()&&!p.phone);
      if(matched){
        setPlayers(prev=>({...prev,[matched.gender]:prev[matched.gender].map(p=>p.id===matched.id?{...p,phone:reg.phone}:p)}));
        try{await sbFetch(`players?id=eq.${matched.id}`,{method:"PATCH",body:JSON.stringify({phone:reg.phone})});}catch(e){console.error(e);}
      }
    }
    try{await sbFetch(`registrations?id=eq.${reg.id}`,{method:"PATCH",body:JSON.stringify({status:"approved"})});}catch(e){console.error(e);}
    showNotif("Đã duyệt: "+reg.name);
  };

  const handleRejectReg=async(reg)=>{
    setRegList(prev=>prev.map(r=>r.id===reg.id?{...r,status:"rejected"}:r));
    try{await sbFetch(`registrations?id=eq.${reg.id}`,{method:"PATCH",body:JSON.stringify({status:"rejected"})});}catch(e){console.error(e);}
    showNotif(`Đã từ chối: ${reg.name}`,"err");
  };

  const handleAddPlayer=async()=>{
    if(!newPlayer.name.trim())return;
    const boom=TIER_BOOM[newPlayer.tier]||2.5;
    const id=Date.now();
    const phone=(newPlayer.phone||"").trim();
    if(phone){
      const dup=allPlayers.find(pl=>pl.phone&&pl.phone===phone);
      if(dup){showNotif("SĐT đã tồn tại: "+dup.name,"err");return;}
    }
    const p={id,name:newPlayer.name,tier:newPlayer.tier,boom,gender:newPlayer.gender,remark:newPlayer.remark||"",phone};
    setPlayers(prev=>({...prev,[newPlayer.gender]:[...prev[newPlayer.gender],p]}));
    setNewPlayer({name:"",tier:"3",gender:"male",remark:"",phone:""});
    setShowAddModal(false);
    showNotif("Đã thêm VĐV "+newPlayer.name);
    try {
      await sbFetch("players",{method:"POST",body:JSON.stringify({id,name:p.name,tier:p.tier,boom:p.boom,gender:p.gender,remark:p.remark||"",phone})});
    } catch(e){ console.error("add player:",e); }
    await addHistory("Thêm VĐV", newPlayer.name, `Tier ${newPlayer.tier}`);
  };

  const handleAdjust=async()=>{
    const p=adjModal;
    const val=parseFloat(adjForm.value);
    if(isNaN(val))return;
    const newBoom=Math.round((p.boom+val)*1000)/1000;
    setPlayers(prev=>({...prev,[p.gender]:prev[p.gender].map(pl=>pl.id===p.id?{...pl,boom:newBoom}:pl)}));
    setAdjModal(null);setAdjForm({type:"",value:0,note:""});
    showNotif(`Đã cập nhật điểm ${p.name}`);
    try {
      await sbFetch(`players?id=eq.${p.id}`,{method:"PATCH",body:JSON.stringify({boom:newBoom})});
    } catch(e){ console.error("adjust:",e); }
    await addHistory("Điều chỉnh điểm", p.name, `${val>0?"+":""}${val} | ${adjForm.note||adjForm.type||"—"}`);
  };

  const handleTierChange=async(p,newTier)=>{
    const newBoom=TIER_BOOM[newTier];
    setPlayers(prev=>({...prev,[p.gender]:prev[p.gender].map(pl=>pl.id===p.id?{...pl,tier:newTier,boom:newBoom}:pl)}));
    showNotif(`Cập nhật Tier ${p.name}`);
    try {
      await sbFetch(`players?id=eq.${p.id}`,{method:"PATCH",body:JSON.stringify({tier:newTier,boom:newBoom})});
    } catch(e){ console.error("tier change:",e); }
    await addHistory("Đổi Tier", p.name, `${p.tier} → ${newTier}`);
  };

  const handleDeletePlayer=async(p)=>{
    setPlayers(prev=>({...prev,[p.gender]:prev[p.gender].filter(pl=>pl.id!==p.id)}));
    setDeleteConfirm(null);
    showNotif(`Đã xóa VĐV ${p.name}`,"ok");
    try {
      await sbFetch(`players?id=eq.${p.id}`,{method:"DELETE"});
    } catch(e){ console.error("delete:",e); }
    await addHistory("Xóa VĐV", p.name, `Tier ${p.tier} | ${p.gender==="male"?"Nam":"Nữ"}`);
  };

  const handleEditPlayer=async()=>{
    const p=editModal;
    if(!editForm.name.trim())return;
    const newBoom=editForm.tier!==p.tier?TIER_BOOM[editForm.tier]:p.boom;
    const newRemark=editForm.remark||"";
    const newPhone=(editForm.phone||"").trim();
    if(newPhone&&newPhone!==p.phone){
      const dup=allPlayers.find(pl=>pl.id!==p.id&&pl.phone&&pl.phone===newPhone);
      if(dup){showNotif("SĐT đã tồn tại: "+dup.name,"err");return;}
    }
    if(editForm.gender!==p.gender){
      setPlayers(prev=>({
        ...prev,
        [p.gender]:prev[p.gender].filter(pl=>pl.id!==p.id),
        [editForm.gender]:[...prev[editForm.gender],{...p,name:editForm.name,tier:editForm.tier,boom:newBoom,gender:editForm.gender,remark:newRemark,phone:newPhone}],
      }));
    } else {
      setPlayers(prev=>({...prev,[p.gender]:prev[p.gender].map(pl=>pl.id===p.id?{...pl,name:editForm.name,tier:editForm.tier,boom:newBoom,remark:newRemark,phone:newPhone}:pl)}));
    }
    setEditModal(null);
    showNotif(`Đã cập nhật VĐV ${editForm.name}`);
    try {
      await sbFetch(`players?id=eq.${p.id}`,{method:"PATCH",body:JSON.stringify({name:editForm.name,tier:editForm.tier,boom:newBoom,gender:editForm.gender,remark:newRemark,phone:newPhone})});
    } catch(e){ console.error("edit:",e); }
    await addHistory("Sửa VĐV", editForm.name, `Tier ${editForm.tier} | ${editForm.gender==="male"?"Nam":"Nữ"}`);
  };

  const handleResetData=async()=>{
    const allInit=[
      ...INIT.male.map(p=>({id:p.id,name:p.name,tier:p.tier,boom:p.boom,gender:"male"})),
      ...INIT.female.map(p=>({id:p.id,name:p.name,tier:p.tier,boom:p.boom,gender:"female"})),
    ];
    setPlayers(INIT);
    setHistory([]);
    showNotif("Đã khôi phục dữ liệu gốc");
    try {
      await sbFetch("players",{method:"DELETE",headers:{"Prefer":"return=minimal"}});
      await sbFetch("history",{method:"DELETE",headers:{"Prefer":"return=minimal"}});
      await sbFetch("players",{method:"POST",body:JSON.stringify(allInit)});
    } catch(e){ console.error("reset:",e); }
  };

  const toggleMm=(p)=>{
    setMmResult(null);
    setMmSel(prev=>prev.find(x=>x.id===p.id)?prev.filter(x=>x.id!==p.id):prev.length>=4?prev:[...prev,p]);
  };

  const handleCreateTour = async () => {
    if(!tourForm.name.trim()||!tourForm.date.trim()) return;
    const id = Date.now();
    const pin = tourForm.pin.trim() || Math.floor(1000+Math.random()*9000).toString();
    const tour = {id, name:tourForm.name.trim(), date:tourForm.date, format:tourForm.format, rounds:parseInt(tourForm.rounds)||1, note:tourForm.note.trim(), matches:[], status:"active", created:new Date().toLocaleString("vi-VN"), pin, bestOf:parseInt(tourForm.bestOf)||3};
    setTournaments(prev=>[tour,...prev]);
    setShowTourModal(false);
    setTourForm({name:"",date:"",format:"double",rounds:"1",note:"",pin:"",bestOf:"3"});
    setActiveTour(tour);
    setTab("tournament");
    showNotif("Đã tạo giải: "+tour.name);
    try {
      const payload = {
        id: tour.id,
        name: tour.name,
        date: tour.date,
        format: tour.format,
        rounds: tour.rounds,
        note: tour.note,
        matches: "[]",
        tour_regs: "[]",
        status: "active",
        created: tour.created,
        pin: tour.pin,
        best_of: tour.bestOf,
      };
      await sbFetch("tournaments", {method:"POST", headers:{"Prefer":"return=minimal"}, body:JSON.stringify(payload)});
    } catch(e){console.error("create tour error:",e);}
  };

  const handleAddMatch = async () => {
    if(!activeTour) return;
    const {p1,p2,p3,p4,score1,score2,round} = matchForm;
    if(!p1||!score1||!score2) return;
    const isDouble = activeTour.format==="double";
    const match = {
      id: Date.now(),
      round: parseInt(round)||1,
      format: activeTour.format,
      team1: isDouble ? [p1,p2].filter(Boolean) : [p1],
      team2: isDouble ? [p3,p4].filter(Boolean) : [p3],
      score1: parseInt(score1)||0,
      score2: parseInt(score2)||0,
      time: new Date().toLocaleString("vi-VN"),
    };
    const updatedMatches = [...(activeTour.matches||[]), match];
    const updatedTour = {...activeTour, matches: updatedMatches};
    setTournaments(prev=>prev.map(t=>t.id===activeTour.id?updatedTour:t));
    setActiveTour(updatedTour);
    setShowMatchModal(false);
    setMatchForm({p1:"",p2:"",p3:"",p4:"",score1:"",score2:"",round:"1"});
    showNotif("Đã thêm kết quả trận đấu");
    try { await sbFetch(`tournaments?id=eq.${activeTour.id}`,{method:"PATCH",body:JSON.stringify({matches:JSON.stringify(updatedMatches)})}); } catch(e){console.error(e);}
  };

  const handleUpdateTour = async () => {
    if(!editTourModal||!editTourModal.form.name.trim()||!editTourModal.form.date.trim()) return;
    const {form, tour} = editTourModal;
    const updated = {
      ...tour,
      name: form.name.trim(),
      date: form.date.trim(),
      format: form.format,
      rounds: parseInt(form.rounds)||1,
      note: form.note.trim(),
      pin: form.pin.trim()||tour.pin,
      bestOf: parseInt(form.bestOf)||3,
    };
    setTournaments(prev=>prev.map(t=>t.id===tour.id?updated:t));
    if(activeTour?.id===tour.id) setActiveTour(updated);
    if(viewTour?.id===tour.id) setViewTour(updated);
    setEditTourModal(null);
    showNotif("Đã cập nhật giải: "+updated.name);
    try {
      await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({
        name: updated.name,
        date: updated.date,
        format: updated.format,
        rounds: updated.rounds,
        note: updated.note,
        pin: updated.pin,
        best_of: updated.bestOf,
      })});
    } catch(e){console.error("update tour error:",e);}
  };

  const handleEndTour = async (tour) => {
    const updated = {...tour, status:"finished"};
    setTournaments(prev=>prev.map(t=>t.id===tour.id?updated:t));
    if(activeTour?.id===tour.id) setActiveTour(updated);
    showNotif("Đã kết thúc giải: "+tour.name);
    try { await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({status:"finished"})}); } catch(e){console.error(e);}
  };

  const handleDeleteTour = async (tour) => {
    setTournaments(prev=>prev.filter(t=>t.id!==tour.id));
    if(activeTour?.id===tour.id){setActiveTour(null);setTab("tournament");}
    if(viewTour?.id===tour.id) setViewTour(null);
    showNotif("Đã xóa giải: "+tour.name,"err");
    try { await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"DELETE"}); } catch(e){console.error(e);}
  };

  const getPlayerStats = (playerName) => {
    let wins=0,losses=0,totalMatches=0,tourList=[],matchHistory=[];
    tournaments.forEach(tour=>{
      let inTour=false;
      (tour.matches||[]).forEach(m=>{
        const inT1=(m.team1||[]).includes(playerName);
        const inT2=(m.team2||[]).includes(playerName);
        if(!inT1&&!inT2) return;
        inTour=true; totalMatches++;
        const won=(inT1&&m.score1>m.score2)||(inT2&&m.score2>m.score1);
        const drew=m.score1===m.score2;
        if(won) wins++; else if(!drew) losses++;
        matchHistory.push({
          tourName:tour.name, tourDate:tour.date, tourId:tour.id,
          round:m.round, opponent:inT1?(m.team2||[]).join(" & "):(m.team1||[]).join(" & "),
          myScore:inT1?m.score1:m.score2, oppScore:inT1?m.score2:m.score1,
          won, drew, time:m.time, format:m.format||tour.format,
        });
      });
      if(inTour) tourList.push(tour.name);
    });
    matchHistory.sort((a,b)=>b.tourId-a.tourId);
    return {wins,losses,totalMatches,winRate:totalMatches?Math.round(wins/totalMatches*100):0,tourList:[...new Set(tourList)],matchHistory};
  };

  const handleTourRegister = async () => {
    const {tourId,playerName,contact,content,partner,note} = tourRegForm;
    if(!tourId||!playerName) return;
    const tour = tournaments.find(t=>t.id===parseInt(tourId)||t.id===tourId);
    if(!tour) return;
    const entry = {id:Date.now(),tourId:tour.id,tourName:tour.name,playerName,contact,content,partner,note,status:"pending",time:new Date().toLocaleString("vi-VN")};
    const updatedRegs = [...(tour.tourRegs||[]), entry];
    const updatedTour = {...tour, tourRegs: updatedRegs};
    setTournaments(prev=>prev.map(t=>t.id===tour.id?updatedTour:t));
    if(activeTour?.id===tour.id) setActiveTour(updatedTour);
    setTourRegSubmitted(true);
    setTourRegForm({tourId:"",playerName:"",contact:"",content:"single",partner:"",note:""});
    showNotif("Đã đăng ký giải: "+tour.name);
    try {
      await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({"tour_regs":JSON.stringify(updatedRegs)})});
    } catch(e){console.error(e);}
  };

  const handleTourRegApprove = async (tour, regId) => {
    const reg = (tour.tourRegs||[]).find(r=>r.id===regId);
    const updatedRegs = (tour.tourRegs||[]).map(r=>r.id===regId?{...r,status:"approved",approvedBy:auth.user?.label||"Admin",approvedAt:new Date().toLocaleString("vi-VN")}:r);
    const updatedTour = {...tour, tourRegs: updatedRegs};
    setTournaments(prev=>prev.map(t=>t.id===tour.id?updatedTour:t));
    if(activeTour?.id===tour.id) setActiveTour(updatedTour);
    if(showTourRegAdmin?.id===tour.id) setShowTourRegAdmin(updatedTour);
    if(viewTour?.id===tour.id) setViewTour(updatedTour);
    showNotif("Đã duyệt: "+(reg?.playerName||""));
    try { await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({"tour_regs":JSON.stringify(updatedRegs)})}); } catch(e){console.error(e);}
  };

  const handleTourRegReject = async (tour, regId, reason="") => {
    const reg = (tour.tourRegs||[]).find(r=>r.id===regId);
    const updatedRegs = (tour.tourRegs||[]).map(r=>r.id===regId?{...r,status:"rejected",rejectedBy:auth.user?.label||"Admin",rejectedAt:new Date().toLocaleString("vi-VN"),rejectReason:reason}:r);
    const updatedTour = {...tour, tourRegs: updatedRegs};
    setTournaments(prev=>prev.map(t=>t.id===tour.id?updatedTour:t));
    if(activeTour?.id===tour.id) setActiveTour(updatedTour);
    if(showTourRegAdmin?.id===tour.id) setShowTourRegAdmin(updatedTour);
    if(viewTour?.id===tour.id) setViewTour(updatedTour);
    showNotif("Đã từ chối: "+(reg?.playerName||""),"err");
    try { await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({"tour_regs":JSON.stringify(updatedRegs)})}); } catch(e){console.error(e);}
  };

  const handleTourRegCancel = async (tour, regId) => {
    const updatedRegs = (tour.tourRegs||[]).map(r=>r.id===regId?{...r,status:"cancelled"}:r);
    const updatedTour = {...tour, tourRegs: updatedRegs};
    setTournaments(prev=>prev.map(t=>t.id===tour.id?updatedTour:t));
    if(activeTour?.id===tour.id) setActiveTour(updatedTour);
    if(viewTour?.id===tour.id) setViewTour(updatedTour);
    showNotif("Đã hủy đăng ký");
    try { await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({"tour_regs":JSON.stringify(updatedRegs)})}); } catch(e){console.error(e);}
  };

  const openGroupDraw = (tour) => {
    const approved = (tour.tourRegs||[]).filter(r=>r.status==="approved");
    const allP = [...players.male.map(p=>({...p,gender:"male"})),...players.female.map(p=>({...p,gender:"female"}))];
    const findBoom = (name) => { const found = allP.find(p=>p.name===name); return found ? found.boom : 2.1; };
    const entries = [];
    approved.forEach(r => {
      if(r.content==="single"){ entries.push({name:r.playerName,boom:findBoom(r.playerName),regId:r.id,type:"single"}); }
      else { entries.push({name:r.playerName+(r.partner?" / "+r.partner:""),boom:(findBoom(r.playerName)+(r.partner?findBoom(r.partner):0))/(r.partner?2:1),regId:r.id,type:r.content,partner:r.partner||""}); }
    });
    const entries2 = entries;
    setGroupConfig({numGroups:Math.min(4,Math.max(2,Math.ceil(entries2.length/4))),seedBy:"tier",players:entries2.map(p=>({...p,selected:true}))});
    setShowGroupDrawModal(tour);
  };
  const handleGenerateGroups = async () => {
    if(!showGroupDrawModal) return;
    const tour = showGroupDrawModal;
    const {numGroups, seedBy, players} = groupConfig;
    const selected = players.filter(p=>p.selected);
    if(selected.length < 2) { showNotif("Cần ít nhất 2 người chơi","err"); return; }
    const n = parseInt(numGroups)||2;
    let sorted = [...selected];
    if(seedBy==="tier") sorted.sort((a,b)=>b.boom-a.boom);
    else if(seedBy==="random") sorted.sort(()=>Math.random()-0.5);
    const groups = Array.from({length:n},(_,i)=>({name:"Bảng "+String.fromCharCode(65+i),players:[],matches:[]}));
    sorted.forEach((p,idx)=>{
      const round = Math.floor(idx/n);
      const pos = round%2===0 ? idx%n : n-1-(idx%n);
      groups[pos].players.push(p.name);
    });
    const updatedTour = {...tour, groups};
    setTournaments(prev=>prev.map(t=>t.id===tour.id?updatedTour:t));
    if(viewTour?.id===tour.id) setViewTour(updatedTour);
    if(activeTour?.id===tour.id) setActiveTour(updatedTour);
    setShowGroupDrawModal(null);
    showNotif("Đã chia "+n+" bảng thành công!");
    try { await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({groups:JSON.stringify(groups)})}); } catch(e){console.error(e);}
  };
  const handleDeleteGroups = async (tour) => {
    const updatedTour = {...tour, groups:[]};
    setTournaments(prev=>prev.map(t=>t.id===tour.id?updatedTour:t));
    if(viewTour?.id===tour.id) setViewTour(updatedTour);
    if(activeTour?.id===tour.id) setActiveTour(updatedTour);
    showNotif("Đã xóa bảng đấu","err");
    try { await sbFetch(`tournaments?id=eq.${tour.id}`,{method:"PATCH",body:JSON.stringify({groups:"[]"})}); } catch(e){console.error(e);}
  };

  const handleRefPinSubmit = () => {
    const tour = tournaments.find(t => t.pin === refPinInput && t.status === "active");
    if(tour){ setRefTour(tour); setRefPinErr(""); setRefPinInput(""); }
    else setRefPinErr("Mã PIN không đúng hoặc giải đã kết thúc");
  };

  const handleRefStartMatch = (match) => {
    const numGames = refTour?.bestOf || 3;
    setRefMatch(match);
    setRefGames(Array.from({length:numGames},()=>({t1:"",t2:""})));
    setRefConfirmed(false);
  };

  const handleRefSaveMatch = async () => {
    if(!refTour || !refMatch) return;
    let s1=0, s2=0;
    refGames.forEach(g => {
      const g1=parseInt(g.t1)||0, g2=parseInt(g.t2)||0;
      if(g1>0||g2>0){ if(g1>g2) s1++; else if(g2>g1) s2++; }
    });
    const updatedMatch = {
      ...refMatch,
      score1: s1,
      score2: s2,
      games: refGames.map(g=>({t1:parseInt(g.t1)||0,t2:parseInt(g.t2)||0})),
      confirmed: true,
      confirmedAt: new Date().toLocaleString("vi-VN"),
    };
    const existing = (refTour.matches||[]).find(m=>m.id===refMatch.id);
    const updatedMatches = existing
      ? (refTour.matches||[]).map(m=>m.id===refMatch.id ? updatedMatch : m)
      : [...(refTour.matches||[]), updatedMatch];
    const updatedTour = {...refTour, matches: updatedMatches};
    setTournaments(prev=>prev.map(t=>t.id===refTour.id ? updatedTour : t));
    setRefTour(updatedTour);
    setRefConfirmed(true);
    try { await sbFetch(`tournaments?id=eq.${refTour.id}`,{method:"PATCH",body:JSON.stringify({matches:JSON.stringify(updatedMatches)})}); }
    catch(e){console.error(e);}
  };

  const handleRefExitMatch = () => { setRefMatch(null); setRefGames([]); setRefConfirmed(false); };

  const NAV=[
    {key:"dashboard",icon:"📊",label:"Tổng quan"},
    {key:"players",icon:"👥",label:"VĐV"},
    {key:"ranking",icon:"🏆",label:"Xếp hạng"},
    {key:"tournament",icon:"🏅",label:"Giải đấu"},
    {key:"roles",icon:"🔐",label:"Phân quyền",adminOnly:true},

    {key:"history",icon:"📋",label:"Lịch sử"},
    {key:"rules",icon:"📜",label:"Quy định"},
  ];

  useEffect(()=>{
    if(!document.querySelector('meta[name="viewport"]')){
      const vm=document.createElement("meta");
      vm.name="viewport";
      vm.content="width=device-width,initial-scale=1,maximum-scale=1,viewport-fit=cover";
      document.head.appendChild(vm);
    }
    const el=document.createElement("style");
    el.textContent=`
      *,*::before,*::after{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
      html,body{margin:0;padding:0;overflow:hidden;height:100%;-webkit-text-size-adjust:100%;}
      body{overscroll-behavior-y:auto;}
      input,select,textarea,button{font-family:inherit;-webkit-appearance:none;appearance:none;}
      select{-webkit-appearance:none;appearance:none;}
      ::-webkit-scrollbar{width:4px;height:4px;}
      ::-webkit-scrollbar-track{background:transparent;}
      ::-webkit-scrollbar-thumb{background:rgba(255,107,53,0.3);border-radius:4px;}
      @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
    `;
    document.head.appendChild(el);
    return()=>document.head.removeChild(el);
  },[]);

  return (
    <>
    <div style={{height:"100dvh",background:"linear-gradient(160deg,#111 0%,#181818 60%,#222 100%)",color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif",overflowX:"hidden",overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
      <div style={{position:"fixed",top:-150,left:-150,width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,53,0.09) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:-120,right:-120,width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,180,71,0.07) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>

      <header style={{background:"rgba(13,13,13,0.97)",borderBottom:"1px solid "+C.border,position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 20px rgba(0,0,0,0.6)",paddingTop:"env(safe-area-inset-top,0px)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",maxWidth:900,margin:"0 auto",gap:8,minWidth:0}}>
          <div onClick={()=>setTab("dashboard")} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
            <span style={{fontSize:26,filter:"drop-shadow(0 0 10px rgba(255,107,53,0.7))"}}>🏓</span>
            <div>
              <div style={{fontSize:16,fontWeight:900,letterSpacing:3,background:"linear-gradient(90deg,#FF6B35,#FFB347)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1}}>PICKLEBOOM</div>
              <div style={{fontSize:9,color:C.dim,letterSpacing:1,marginTop:1}}>Đà Nẵng · <span style={{color:dbReady?"#4ADE80":"#FFB347"}}>{dbReady?"● Online":"● Connecting..."}</span></div>
            </div>
          </div>
          {isAdmin?(
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{textAlign:"right",minWidth:0,overflow:"hidden"}}>
                <div style={{fontSize:10,color:ROLE_PERMISSIONS[userRole]?.color||"#FF6B35",fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ROLE_PERMISSIONS[userRole]?.badge||"🔐"} {auth.user.label}</div>
                <div style={{fontSize:9,color:C.dim}}>Admin</div>
              </div>
              <button onClick={handleLogout} style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.35)",color:"#EF4444",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>Đăng xuất</button>
              <button onClick={()=>{if(can("canResetData")&&window.confirm("Reset toàn bộ dữ liệu về mặc định?"))handleResetData();}} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.dim,borderRadius:8,padding:"6px 8px",cursor:"pointer",fontSize:13,fontWeight:700,flexShrink:0}} title="Reset dữ liệu gốc">↺</button>
            </div>
          ):(
<div style={{display:"flex",gap:6}}>
              <button onClick={()=>{setRefMode(true);setRefTour(null);setRefPinInput("");setRefPinErr("");}} style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.35)",color:"#60A5FA",borderRadius:8,padding:"7px 10px",cursor:"pointer",fontSize:12,fontWeight:700}}>
                🏳️ Trọng tài
              </button>
              <button onClick={()=>setAuth(a=>({...a,showLogin:true}))} style={{background:"rgba(255,107,53,0.12)",border:"1px solid rgba(255,107,53,0.35)",color:"#FF6B35",borderRadius:8,padding:"7px 12px",cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:5}}>
                🔑 Đăng nhập
              </button>
            </div>
          )}
        </div>
      </header>

      {syncing?(
        <div style={{position:"fixed",top:"calc(56px + env(safe-area-inset-top,0px))",left:"50%",transform:"translateX(-50%)",zIndex:299,padding:"6px 16px",borderRadius:20,background:"rgba(255,107,53,0.15)",border:"1px solid rgba(255,107,53,0.3)",fontSize:11,color:"#FF6B35",fontWeight:600,display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
          <span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>⟳</span> Đang đồng bộ...
        </div>
      ):(
        <div style={{position:"fixed",top:"calc(56px + env(safe-area-inset-top,0px))",right:12,zIndex:299}}>
          <button onClick={loadFromDB} title="Tải lại dữ liệu từ server" style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:20,padding:"5px 12px",cursor:"pointer",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
            🔄 Tải lại
          </button>
        </div>
      )}

      {notif&&(
        <div style={{position:"fixed",top:"calc(64px + env(safe-area-inset-top,0px))",left:"50%",transform:"translateX(-50%)",zIndex:300,padding:"10px 20px",borderRadius:20,color:"#fff",fontSize:13,fontWeight:600,boxShadow:"0 8px 24px rgba(0,0,0,0.5)",background:notif.type==="ok"?"#FF6B35":"#EF4444",whiteSpace:"nowrap",maxWidth:"calc(100vw - 32px)",textAlign:"center",animation:"fadeIn 0.2s ease"}}>
          {notif.type==="ok"?"✓":"✗"} {notif.msg}
        </div>
      )}

      <main style={{maxWidth:900,margin:"0 auto",padding:"16px 12px calc(80px + env(safe-area-inset-bottom,0px))",position:"relative",zIndex:1}}>

        {tab==="dashboard"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{fontSize:18,fontWeight:800,color:C.orange}}>Tổng quan CLB</div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,width:"100%"}}>
              {[
                {label:"Tổng VĐV",value:stats.total,icon:"👥",color:"#FF6B35"},
                {label:"Điểm TB",value:stats.avg,icon:"⭐",color:"#FFB347"},
                {label:"Nam",value:stats.male,icon:"♂",color:"#60A5FA"},
                {label:"Nữ",value:stats.female,icon:"♀",color:"#F9A8D4"},
              ].map((st,i)=>(
                <Card key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px"}}>
                  <div style={{width:40,height:40,borderRadius:12,background:"rgba(255,107,53,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{st.icon}</div>
                  <div>
                    <div style={{fontSize:24,fontWeight:900,color:st.color,lineHeight:1}}>{st.value}</div>
                    <div style={{fontSize:11,color:C.muted,marginTop:2}}>{st.label}</div>
                  </div>
                </Card>
              ))}
            </div>

            <Card>
              <div style={{display:"flex",gap:0,marginBottom:14,borderRadius:10,overflow:"hidden",border:"1px solid "+C.border}}>
                {["male","female"].map(g=>(
                  <button key={g} onClick={()=>setRankGender(g)} style={{flex:1,padding:"9px",border:"none",cursor:"pointer",fontWeight:700,fontSize:13,background:rankGender===g?C.orange:"transparent",color:rankGender===g?"#fff":C.muted,transition:"all 0.2s"}}>
                    {g==="male"?"♂ Top Nam":"♀ Top Nữ"}
                  </button>
                ))}
              </div>
              {(rankGender==="male"?topMale:topFemale).map((p,i)=>(
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 4px",borderBottom:i<4?"1px solid rgba(255,107,53,0.08)":"none"}}>
                  <span style={{width:30,textAlign:"center",fontSize:i<3?18:13,flexShrink:0}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":"#"+(i+1)}</span>
                  <span style={{flex:1,fontWeight:600,fontSize:14}}>{p.name}</span>
                  <TierChip tier={p.tier}/>
                  <BoomBadge boom={p.boom} tier={p.tier}/>
                </div>
              ))}
            </Card>

            <Card>
              <SectionTitle>📊 Phân bố Tier</SectionTitle>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {TIERS.map(t=>{
                  const cnt=stats.tc[t]||0;
                  const pct=(cnt/stats.total)*100;
                  return(
                    <div key={t} style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{width:28,fontWeight:800,fontSize:12,color:TIER_COLORS[t],flexShrink:0}}>{t}</span>
                      <div style={{flex:1,height:5,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden"}}>
                        <div style={{width:pct+"%",height:"100%",background:TIER_COLORS[t],borderRadius:4}}/>
                      </div>
                      <span style={{width:20,fontSize:11,color:C.muted,textAlign:"right",flexShrink:0}}>{cnt}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {tab==="players"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontSize:18,fontWeight:800,color:C.orange}}>VĐV ({filtered.length})</div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>{setShowRegModal(true);setRegSubmitted(false);setRegForm({name:"",email:"",pvna:"",gender:"male",phone:"",note:""}); }} style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.35)",color:"#60A5FA",borderRadius:10,padding:"9px 12px",cursor:"pointer",fontSize:13,fontWeight:700}}>📝 Đăng ký</button>
                {isAdmin&&can("canAddPlayers")&&(
                  <button onClick={()=>setShowAddModal(true)} style={{background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"9px 16px",cursor:"pointer",fontSize:13,fontWeight:700,boxShadow:"0 4px 12px rgba(255,107,53,0.35)"}}>+ Thêm</button>
                )}
              </div>
            </div>

            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <input placeholder="🔍 Tìm tên..." value={search} onChange={e=>setSearch(e.target.value)}
                style={{flex:"1 1 140px",minWidth:0,background:"rgba(255,255,255,0.05)",border:"1px solid "+C.border,borderRadius:10,padding:"11px 12px",color:C.text,fontSize:16,outline:"none"}}/>
              <div style={{display:"flex",gap:8,flex:"0 0 auto"}}>
                <select value={filterGender} onChange={e=>setFilterGender(e.target.value)} style={{background:"rgba(255,255,255,0.07)",border:"1px solid "+C.border,borderRadius:10,padding:"11px 10px",color:C.text,fontSize:16,outline:"none",cursor:"pointer"}}>
                  <option value="all">Tất cả</option><option value="male">Nam</option><option value="female">Nữ</option>
                </select>
                <select value={filterTier} onChange={e=>setFilterTier(e.target.value)} style={{background:"rgba(255,255,255,0.07)",border:"1px solid "+C.border,borderRadius:10,padding:"11px 10px",color:C.text,fontSize:16,outline:"none",cursor:"pointer"}}>
                  <option value="all">Mọi Tier</option>
                  {TIERS.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {filtered.map((p,i)=>(
                <Card key={p.id} style={{padding:"12px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:32,height:32,borderRadius:10,background:"rgba(255,107,53,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <span style={{fontSize:14,color:p.gender==="male"?"#60A5FA":"#F9A8D4"}}>{p.gender==="male"?"♂":"♀"}</span>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                        <span style={{fontWeight:700,fontSize:14,color:C.text}}>{p.name}</span>

                      </div>
                      {p.remark&&(
                        <div style={{fontSize:10,color:"#FFB347",marginTop:3,fontStyle:"italic",display:"flex",alignItems:"center",gap:4}}>
                          <span>📝</span><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.remark}</span>
                        </div>
                      )}
                      <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
                        {can("canEditPlayers")?(
                          <select value={p.tier} onChange={e=>handleTierChange(p,e.target.value)}
                            style={{background:"transparent",border:"1px solid "+TIER_COLORS[p.tier]+"66",borderRadius:8,padding:"4px 6px",fontSize:16,fontWeight:800,cursor:"pointer",outline:"none",color:TIER_COLORS[p.tier]}}>
                            {TIERS.map(t=><option key={t} value={t}>{t}</option>)}
                          </select>
                        ):(
                          <TierChip tier={p.tier}/>
                        )}
                        <BoomBadge boom={p.boom} tier={p.tier}/>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,flexShrink:0}}>
                      <button onClick={()=>setPlayerHistoryView(p.name)}
                        style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:C.muted,borderRadius:10,padding:"8px 10px",cursor:"pointer",fontSize:14}} title="Lịch sử thi đấu">
                        📊
                      </button>
                      {isAdmin&&can("canAdjustScore")&&(
                        <button onClick={()=>{setAdjModal(p);setAdjForm({type:"",value:0,note:""}); }}
                          style={{background:"rgba(255,107,53,0.12)",border:"1px solid rgba(255,107,53,0.35)",color:C.orange,borderRadius:10,padding:"8px 10px",cursor:"pointer",fontSize:14,fontWeight:700}} title="Điều chỉnh điểm">
                          ⚡
                        </button>
                      )}
                      {isAdmin&&can("canEditPlayers")&&(
                        <button onClick={()=>{setEditModal(p);setEditForm({name:p.name,tier:p.tier,gender:p.gender,remark:p.remark||"",phone:p.phone||""});}}
                          style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.35)",color:"#60A5FA",borderRadius:10,padding:"8px 10px",cursor:"pointer",fontSize:14}} title="Sửa thông tin">
                          ✏️
                        </button>
                      )}
                      {isAdmin&&can("canDeletePlayers")&&(
                        <button onClick={()=>setDeleteConfirm(p)}
                          style={{background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.35)",color:"#EF4444",borderRadius:10,padding:"8px 10px",cursor:"pointer",fontSize:14}} title="Xóa VĐV">
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

          </div>
        )}


        {tab==="ranking"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{fontSize:18,fontWeight:800,color:C.orange}}>🏆 Xếp hạng</div>
            <div style={{display:"flex",gap:0,borderRadius:10,overflow:"hidden",border:"1px solid "+C.border}}>
              {["male","female"].map(g=>(
                <button key={g} onClick={()=>setRankGender(g)} style={{flex:1,padding:"10px",border:"none",cursor:"pointer",fontWeight:700,fontSize:13,background:rankGender===g?C.orange:"transparent",color:rankGender===g?"#fff":C.muted,transition:"all 0.2s"}}>
                  {g==="male"?"♂ Nam":"♀ Nữ"}
                </button>
              ))}
            </div>
            <Card>
              <SectionTitle>🥇 Bảng xếp hạng {rankGender==="male"?"Nam":"Nữ"}</SectionTitle>
              {(rankGender==="male"?[...players.male]:[...players.female]).sort((a,b)=>b.boom-a.boom).map((p,i)=>(
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 4px",borderBottom:"1px solid rgba(255,107,53,0.07)"}}>
                  <span style={{width:32,textAlign:"center",fontSize:i<3?20:13,flexShrink:0}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":"#"+(i+1)}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:14,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                    {p.remark&&<div style={{fontSize:10,color:"#FFB347",fontStyle:"italic",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.remark}</div>}
                  </div>
                  <TierChip tier={p.tier}/>
                  <BoomBadge boom={p.boom} tier={p.tier}/>
                  <button onClick={()=>setPlayerHistoryView(p.name)} style={{background:"rgba(255,107,53,0.1)",border:"none",color:C.orange,borderRadius:8,padding:"5px 8px",cursor:"pointer",fontSize:12}}>📊</button>
                </div>
              ))}
            </Card>

          </div>
        )}


        {tab==="history"&&(()=>{
          const allMatches=[];
          tournaments.forEach(tour=>{
            (tour.matches||[]).forEach(m=>{
              allMatches.push({...m,tourName:tour.name,tourDate:tour.date,tourStatus:tour.status});
            });
          });
          allMatches.sort((a,b)=>b.id-a.id);
          const totalMatches=allMatches.length;
          const totalTours=tournaments.length;
          const activeTours=tournaments.filter(t=>t.status==="active").length;
          const totalPlayers=allPlayers.length;
          return(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{fontSize:18,fontWeight:800,color:C.orange}}>📋 Lịch sử</div>
            {/* Summary stats */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[
                {icon:"🏓",label:"Tổng trận",v:totalMatches,c:C.orange},
                {icon:"🏅",label:"Giải đấu",v:totalTours,c:"#60A5FA"},
                {icon:"🟢",label:"Đang diễn",v:activeTours,c:"#4ADE80"},
                {icon:"👥",label:"VĐV",v:totalPlayers,c:"#F9A8D4"},
              ].map((s,i)=>(
                <Card key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px"}}>
                  <span style={{fontSize:22,flexShrink:0}}>{s.icon}</span>
                  <div>
                    <div style={{fontSize:22,fontWeight:900,color:s.c,lineHeight:1}}>{s.v}</div>
                    <div style={{fontSize:11,color:C.muted,marginTop:2}}>{s.label}</div>
                  </div>
                </Card>
              ))}
            </div>
            {/* Recent matches */}
            <Card>
              <SectionTitle>🏓 Kết quả gần đây</SectionTitle>
              {!allMatches.length&&<div style={{textAlign:"center",color:C.dim,padding:20,fontSize:13}}>Chưa có trận đấu nào</div>}
              {allMatches.slice(0,30).map((m,i,arr)=>(
                <div key={m.id||i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i!==arr.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
                  <div style={{flexShrink:0,textAlign:"center",minWidth:28}}>
                    <div style={{fontSize:10,color:C.dim}}>R{m.round}</div>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      <span style={{fontSize:13,fontWeight:700,color:m.score1>m.score2?"#4ADE80":C.text,maxWidth:"35%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(m.team1||[]).join(" & ")}</span>
                      <span style={{fontSize:14,fontWeight:900,color:C.text,background:"rgba(255,255,255,0.06)",borderRadius:6,padding:"1px 8px",flexShrink:0}}>{m.score1}–{m.score2}</span>
                      <span style={{fontSize:13,fontWeight:700,color:m.score2>m.score1?"#4ADE80":C.text,maxWidth:"35%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(m.team2||[]).join(" & ")}</span>
                    </div>
                    <div style={{fontSize:10,color:C.dim,marginTop:2}}>{m.tourName} · {m.tourDate}</div>
                  </div>
                </div>
              ))}
            </Card>
            {/* System activity log */}
            {!!history.length&&(
              <Card>
                <SectionTitle>⚡ Nhật ký hệ thống</SectionTitle>
                {history.slice(0,20).map((h,i,arr)=>(
                  <div key={h.id||i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 0",borderBottom:i!==arr.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
                    <div style={{width:28,height:28,borderRadius:8,background:"rgba(255,107,53,0.08)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12}}>
                      {h.action.includes("Thêm")?"➕":h.action.includes("Xóa")?"🗑️":h.action.includes("Sửa")?"✏️":h.action.includes("Tier")?"🏷️":h.action.includes("điểm")?"⚡":"📝"}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:600,color:C.text}}>{h.action}: <span style={{color:C.orange}}>{h.player}</span></div>
                      {h.detail&&<div style={{fontSize:11,color:C.muted,marginTop:1}}>{h.detail}</div>}
                      <div style={{fontSize:10,color:C.dim,marginTop:2}}>🕐 {h.time}</div>
                    </div>
                  </div>
                ))}
              </Card>
            )}
          </div>
          );
        })()}

        {tab==="roles"&&isAdmin&&can("canManageRoles")&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{fontSize:18,fontWeight:800,color:C.orange}}>🔐 Phân quyền</div>
            {ADMIN_CREDENTIALS.map((cred,i)=>{
              const rp=ROLE_PERMISSIONS[cred.role]||{};
              return(
                <Card key={i}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <div style={{width:36,height:36,borderRadius:10,background:"rgba(255,107,53,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{(rp.badge||"👤").split(" ")[0]}</div>
                    <div>
                      <div style={{fontWeight:800,fontSize:14,color:rp.color||C.text}}>{cred.label}</div>
                      <div style={{fontSize:11,color:C.dim}}>@{cred.username} · {rp.label}</div>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    {[["canAddPlayers","Thêm VĐV"],["canEditPlayers","Sửa VĐV"],["canDeletePlayers","Xóa VĐV"],["canAdjustScore","Điều chỉnh điểm"],["canCreateTournament","Tạo giải"],["canManageTournament","Quản lý giải"],["canApproveReg","Duyệt đăng ký"],["canResetData","Reset data"],["canManageRoles","Quản lý quyền"]].map(([pm,l])=>(
                      <div key={pm} style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:rp[pm]?C.text:C.dim}}>
                        <span style={{color:rp[pm]?"#4ADE80":"#EF4444",fontSize:12}}>{rp[pm]?"✓":"✗"}</span>{l}
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
        {tab==="roles"&&(!isAdmin||!can("canManageRoles"))&&(
          <div style={{textAlign:"center",padding:48,color:C.dim}}>🔒 Chỉ Admin mới có quyền xem</div>
        )}


        {tab==="tournament"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontSize:18,fontWeight:800,color:C.orange}}>🏅 Giải đấu</div>
              {can("canCreateTournament")&&(
                <button onClick={()=>setShowTourModal(true)} style={{background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"9px 16px",cursor:"pointer",fontSize:13,fontWeight:700,boxShadow:"0 4px 12px rgba(255,107,53,0.35)"}}>+ Tạo giải</button>
              )}
            </div>
            {!tournaments.length&&<Card><div style={{textAlign:"center",color:C.dim,padding:24}}>Chưa có giải đấu nào</div></Card>}
            {tournaments.map(tour=>{
              const pendingCount=(tour.tourRegs||[]).filter(r=>r.status==="pending").length;
              const approvedCount=(tour.tourRegs||[]).filter(r=>r.status==="approved").length;
              return(
              <Card key={tour.id}>
                <div onClick={()=>setViewTour(tour)} style={{cursor:"pointer"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <div style={{fontWeight:800,fontSize:15,color:C.text,flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tour.name}</div>
                    <span style={{fontSize:10,padding:"3px 8px",borderRadius:10,fontWeight:700,background:tour.status==="active"?"rgba(74,222,128,0.15)":"rgba(107,114,128,0.15)",color:tour.status==="active"?"#4ADE80":"#6B7280",flexShrink:0,marginLeft:8}}>{tour.status==="active"?"🟢 Đang diễn":"⚫ Kết thúc"}</span>
                  </div>
                  <div style={{fontSize:11,color:C.dim,display:"flex",gap:10,flexWrap:"wrap",marginBottom:6}}>
                    <span>📅 {tour.date}</span>
                    <span>🎮 {tour.format==="single"?"Đơn":tour.format==="double"?"Đôi":"Hỗn hợp"}</span>
                    <span>🏓 {(tour.matches||[]).length} trận</span>
                    <span style={{color:"#4ADE80",fontWeight:600}}>✓ {approvedCount} VĐV</span>
                    {pendingCount&&can("canApproveTourReg")?<span style={{color:"#FBbF24",fontWeight:700}}>⏳ {pendingCount} chờ duyệt</span>:null}
                  </div>
                  {tour.note&&<div style={{fontSize:11,color:C.muted,fontStyle:"italic"}}>{tour.note}</div>}
                </div>
                <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
                  {tour.status==="active"&&(
                    <button onClick={e=>{e.stopPropagation();setShowTourRegForm(tour);setTourRegForm({tourId:String(tour.id),playerName:"",contact:"",content:tour.format==="single"?"single":"double",partner:"",note:""}); setTourRegSubmitted(false);}} style={{flex:1,background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:8,padding:"8px",cursor:"pointer",fontSize:12,fontWeight:700}}>
                      📝 Đăng ký thi đấu
                    </button>
                  )}
                  {can("canManageTournament")&&(
                    <>
                      <button onClick={e=>{e.stopPropagation();setActiveTour(tour);setViewTour(tour);}} style={{background:"rgba(255,107,53,0.12)",border:"1px solid rgba(255,107,53,0.35)",color:C.orange,borderRadius:8,padding:"8px 10px",cursor:"pointer",fontSize:12,fontWeight:700}}>⚙️</button>
                      <button onClick={e=>{e.stopPropagation();setEditTourModal({tour,form:{name:tour.name,date:tour.date,format:tour.format,rounds:String(tour.rounds||1),note:tour.note||"",pin:tour.pin||"",bestOf:String(tour.bestOf||3)}});}} style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.35)",color:"#60A5FA",borderRadius:8,padding:"8px 10px",cursor:"pointer",fontSize:12}}>✏️</button>
                      {tour.status==="active"&&<button onClick={e=>{e.stopPropagation();if(window.confirm("Kết thúc giải "+tour.name+"?"))handleEndTour(tour);}} style={{background:"rgba(251,191,36,0.12)",border:"1px solid rgba(251,191,36,0.35)",color:"#FBbF24",borderRadius:8,padding:"8px 10px",cursor:"pointer",fontSize:12}}>🏁</button>}
                      <button onClick={e=>{e.stopPropagation();if(window.confirm("Xóa giải "+tour.name+"?"))handleDeleteTour(tour);}} style={{background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.35)",color:"#EF4444",borderRadius:8,padding:"8px 10px",cursor:"pointer",fontSize:12}}>🗑️</button>
                    </>
                  )}
                </div>
              </Card>
              );
            })}
            {viewTour&&(
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:200,animation:"fadeIn 0.2s ease"}}>
                <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"90vh",overflowY:"auto",padding:20,border:"1px solid "+C.border}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                    <div style={{fontWeight:800,fontSize:16,color:C.orange,flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{viewTour.name}</div>
                    <button onClick={()=>setViewTour(null)} style={{background:"transparent",border:"none",color:C.dim,cursor:"pointer",fontSize:22,marginLeft:8}}>✕</button>
                  </div>
                  <div style={{fontSize:11,color:C.dim,display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
                    <span>📅 {viewTour.date}</span>
                    <span>🎮 {viewTour.format==="single"?"Đơn":viewTour.format==="double"?"Đôi":"Hỗn hợp"}</span>
                    <span style={{color:viewTour.status==="active"?"#4ADE80":"#6B7280"}}>{viewTour.status==="active"?"🟢 Đang diễn":"⚫ Kết thúc"}</span>
                  </div>
                  {(can("canManageTournament")||can("canApproveTourReg"))&&(
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
                      {can("canManageTournament")&&viewTour.status==="active"&&<button onClick={()=>setShowMatchModal(true)} style={{background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:700}}>+ Thêm trận</button>}
                      {can("canManageTournament")&&<button onClick={()=>openGroupDraw(viewTour)} style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.35)",color:"#60A5FA",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:700}}>🎯 Chia bảng</button>}
                      <button onClick={()=>setShowTourRegAdmin(viewTour)} style={{position:"relative",background:"rgba(251,191,36,0.12)",border:"1px solid rgba(251,191,36,0.35)",color:"#FBbF24",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:700}}>
                        📋 DS Đăng ký
                        {(viewTour.tourRegs||[]).filter(r=>r.status==="pending").length?<span style={{position:"absolute",top:-6,right:-6,background:"#EF4444",color:"#fff",borderRadius:20,fontSize:9,fontWeight:900,padding:"1px 5px",minWidth:16,textAlign:"center"}}>{(viewTour.tourRegs||[]).filter(r=>r.status==="pending").length}</span>:null}
                      </button>
                      {can("canManageTournament")&&viewTour.status==="active"&&<button onClick={()=>{if(window.confirm("Kết thúc giải?"))handleEndTour(viewTour);}} style={{background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.35)",color:"#EF4444",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:700}}>🏁 Kết thúc</button>}
                    </div>
                  )}
                  {!!(viewTour.groups||[]).length&&(
                    <div style={{marginBottom:14}}>
                      <SectionTitle>🎯 Bảng đấu</SectionTitle>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:8}}>
                        {(viewTour.groups||[]).map((g,gi)=>(
                          <div key={gi} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:10,border:"1px solid rgba(255,107,53,0.15)"}}>
                            <div style={{fontWeight:700,fontSize:12,color:C.orange,marginBottom:6}}>{g.name}</div>
                            {(g.players||[]).map((pn,pi)=><div key={pi} style={{fontSize:11,color:C.text,padding:"2px 0",borderBottom:pi!==g.players.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>{pn}</div>)}
                          </div>
                        ))}
                      </div>
                      {can("canManageTournament")&&<button onClick={()=>handleDeleteGroups(viewTour)} style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",color:"#EF4444",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:11,fontWeight:700,marginTop:8}}>🗑️ Xóa bảng</button>}
                    </div>
                  )}
                  {!!(viewTour.matches||[]).length&&(
                    <div>
                      <SectionTitle>🏓 Kết quả ({(viewTour.matches||[]).length} trận)</SectionTitle>
                      {[...viewTour.matches].reverse().map((m,i)=>(
                        <div key={m.id||i} style={{padding:"10px 0",borderBottom:i!==viewTour.matches.length-1?"1px solid rgba(255,107,53,0.07)":"none"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <span style={{fontSize:10,color:C.dim,flexShrink:0}}>R{m.round}</span>
                            <div style={{flex:1,display:"flex",alignItems:"center",gap:6,minWidth:0}}>
                              <span style={{flex:1,fontSize:12,fontWeight:600,color:m.score1>m.score2?C.orange:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"right"}}>{(m.team1||[]).join(" & ")}</span>
                              <span style={{fontWeight:900,fontSize:15,color:C.text,flexShrink:0,padding:"2px 8px",background:"rgba(255,255,255,0.06)",borderRadius:6}}>{m.score1} - {m.score2}</span>
                              <span style={{flex:1,fontSize:12,fontWeight:600,color:m.score2>m.score1?C.orange:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(m.team2||[]).join(" & ")}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {!(viewTour.matches||[]).length&&<div style={{textAlign:"center",color:C.dim,padding:20,fontSize:13}}>Chưa có trận đấu nào</div>}
                </div>
              </div>
            )}
            {showTourRegAdmin&&(
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:201,animation:"fadeIn 0.2s ease"}}>
                <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"92vh",display:"flex",flexDirection:"column",border:"1px solid "+C.border}}>
                  {/* Handle bar */}
                  <div style={{width:40,height:4,background:"rgba(255,255,255,0.15)",borderRadius:4,margin:"12px auto 0",flexShrink:0}}/>
                  {/* Header */}
                  <div style={{padding:"12px 20px 0",flexShrink:0}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                      <div>
                        <div style={{fontWeight:800,fontSize:15,color:C.orange}}>📋 Danh sách đăng ký</div>
                        <div style={{fontSize:11,color:C.dim,marginTop:2}}>{showTourRegAdmin.name} · {showTourRegAdmin.date}</div>
                      </div>
                      <button onClick={()=>{setShowTourRegAdmin(null);setTourRegAdminTab("pending");}} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:C.muted,borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:13,fontWeight:700}}>✕ Đóng</button>
                    </div>
                    {/* Tabs */}
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,margin:"12px 0"}}>
                      {[
                        {key:"pending", label:"Chờ duyệt", color:"#FBbF24", bg:"rgba(251,191,36,0.12)", count:(showTourRegAdmin.tourRegs||[]).filter(r=>r.status==="pending").length},
                        {key:"approved", label:"Đã duyệt", color:"#4ADE80", bg:"rgba(74,222,128,0.12)", count:(showTourRegAdmin.tourRegs||[]).filter(r=>r.status==="approved").length},
                        {key:"rejected", label:"Từ chối", color:"#EF4444", bg:"rgba(239,68,68,0.12)", count:(showTourRegAdmin.tourRegs||[]).filter(r=>r.status==="rejected"||r.status==="cancelled").length},
                      ].map(tb=>(
                        <button key={tb.key} onClick={()=>setTourRegAdminTab(tb.key)} style={{padding:"10px 4px",borderRadius:12,border:"2px solid "+(tourRegAdminTab===tb.key?tb.color+"88":"rgba(255,255,255,0.07)"),background:tourRegAdminTab===tb.key?tb.bg:"transparent",cursor:"pointer",textAlign:"center",transition:"all 0.15s"}}>
                          <div style={{fontSize:22,fontWeight:900,color:tb.color,lineHeight:1}}>{tb.count}</div>
                          <div style={{fontSize:10,color:tourRegAdminTab===tb.key?tb.color:C.dim,marginTop:3,fontWeight:tourRegAdminTab===tb.key?700:400}}>{tb.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Scrollable list */}
                  <div style={{overflowY:"auto",flex:1,padding:"0 20px 24px"}}>
                    {(()=>{
                      const filtered=(showTourRegAdmin.tourRegs||[]).filter(r=>tourRegAdminTab==="rejected"?(r.status==="rejected"||r.status==="cancelled"):r.status===tourRegAdminTab);
                      if(!filtered.length) return(
                        <div style={{textAlign:"center",padding:"40px 0"}}>
                          <div style={{fontSize:36,marginBottom:10}}>{tourRegAdminTab==="pending"?"⏳":tourRegAdminTab==="approved"?"✅":"🚫"}</div>
                          <div style={{color:C.dim,fontSize:13}}>Không có đăng ký nào</div>
                        </div>
                      );
                      return filtered.map((r,i,arr)=>{
                        const p1=allPlayers.find(p=>p.name===r.playerName);
                        const p2=r.partner?allPlayers.find(p=>p.name===r.partner):null;
                        return(
                        <div key={r.id||i} style={{padding:"14px 0",borderBottom:i!==arr.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
                          {/* Player info row */}
                          <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:10}}>
                            <div style={{width:42,height:42,borderRadius:12,background:r.content==="single"?"rgba(255,107,53,0.12)":"rgba(96,165,250,0.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:20}}>
                              {r.content==="single"?"🎾":"🎽"}
                            </div>
                            <div style={{flex:1,minWidth:0}}>
                              {/* Người đăng ký */}
                              <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                                <span style={{fontWeight:800,fontSize:15,color:C.text}}>{r.playerName}</span>
                                {p1&&<TierChip tier={p1.tier}/>}
                                {p1&&<span style={{fontSize:11,color:TIER_COLORS[p1.tier],fontWeight:700}}>{p1.boom.toFixed(2)}</span>}
                                {!p1&&<span style={{fontSize:10,color:C.dim,fontStyle:"italic"}}>Chưa có trong hệ thống</span>}
                              </div>
                              {/* Đồng đội (nếu có) */}
                              {r.partner&&(
                                <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginTop:4,paddingTop:4,borderTop:"1px dashed rgba(255,255,255,0.08)"}}>
                                  <span style={{fontSize:10,color:C.dim,flexShrink:0}}>🤝 Đồng đội:</span>
                                  <span style={{fontWeight:700,fontSize:13,color:C.text}}>{r.partner}</span>
                                  {p2&&<TierChip tier={p2.tier}/>}
                                  {p2&&<span style={{fontSize:11,color:TIER_COLORS[p2.tier],fontWeight:700}}>{p2.boom.toFixed(2)}</span>}
                                  {!p2&&<span style={{fontSize:10,color:C.dim,fontStyle:"italic"}}>Chưa có trong hệ thống</span>}
                                </div>
                              )}
                              {/* Meta */}
                              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:5}}>
                                <span style={{fontSize:10,color:C.dim}}>🕐 {r.time}</span>
                                {r.phone&&<span style={{fontSize:10,color:"#60A5FA"}}>📱 {r.phone}</span>}
                          {r.note&&<span style={{fontSize:10,color:"#FFB347",fontStyle:"italic"}}>💬 {r.note}</span>}
                              </div>
                              {r.approvedBy&&<div style={{fontSize:10,color:"#4ADE80",marginTop:3,fontWeight:600}}>✓ Duyệt bởi {r.approvedBy}</div>}
                              {r.rejectedBy&&<div style={{fontSize:10,color:"#EF4444",marginTop:3,fontWeight:600}}>✗ Từ chối{r.rejectReason?" · "+r.rejectReason:""}</div>}
                            </div>
                          </div>
                          {/* Action buttons */}
                          {r.status==="pending"&&can("canApproveTourReg")&&(
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                              <button onClick={()=>handleTourRegApprove(showTourRegAdmin,r.id)}
                                style={{background:"linear-gradient(90deg,rgba(74,222,128,0.18),rgba(74,222,128,0.1))",border:"1.5px solid rgba(74,222,128,0.5)",color:"#4ADE80",borderRadius:10,padding:"11px",cursor:"pointer",fontSize:14,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                                ✓ Duyệt
                              </button>
                              <button onClick={()=>{const reason=window.prompt("Lý do từ chối (có thể bỏ trống):")||"";handleTourRegReject(showTourRegAdmin,r.id,reason);}}
                                style={{background:"linear-gradient(90deg,rgba(239,68,68,0.18),rgba(239,68,68,0.1))",border:"1.5px solid rgba(239,68,68,0.5)",color:"#EF4444",borderRadius:10,padding:"11px",cursor:"pointer",fontSize:14,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                                ✗ Từ chối
                              </button>
                            </div>
                          )}
                          {r.status==="approved"&&can("canApproveTourReg")&&(
                            <button onClick={()=>handleTourRegReject(showTourRegAdmin,r.id,"Thu hồi")}
                              style={{width:"100%",background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.2)",color:"#EF4444",borderRadius:8,padding:"8px",cursor:"pointer",fontSize:11,fontWeight:600}}>
                              ↩ Thu hồi duyệt
                            </button>
                          )}
                          {r.status==="rejected"&&can("canApproveTourReg")&&(
                            <button onClick={()=>handleTourRegApprove(showTourRegAdmin,r.id)}
                              style={{width:"100%",background:"rgba(74,222,128,0.06)",border:"1px solid rgba(74,222,128,0.2)",color:"#4ADE80",borderRadius:8,padding:"8px",cursor:"pointer",fontSize:11,fontWeight:600}}>
                              ↩ Duyệt lại
                            </button>
                          )}
                        </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab==="rules"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {/* Hero banner */}
            <div style={{borderRadius:18,background:"linear-gradient(135deg,rgba(255,107,53,0.18) 0%,rgba(255,180,71,0.1) 100%)",border:"1px solid rgba(255,107,53,0.3)",padding:"24px 20px",textAlign:"center",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,53,0.15),transparent 70%)",pointerEvents:"none"}}/>
              <div style={{fontSize:40,marginBottom:8}}>🏓</div>
              <div style={{fontSize:22,fontWeight:900,letterSpacing:2,background:"linear-gradient(90deg,#FF6B35,#FFB347)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>PICKLEBOOM</div>
              <div style={{fontSize:12,color:C.muted,marginTop:4,letterSpacing:1}}>CLB Pickleball · Đà Nẵng</div>
              <div style={{display:"flex",justifyContent:"center",gap:16,marginTop:16}}>
                {[{v:allPlayers.length,l:"Thành viên"},{v:players.male.length,l:"Nam"},{v:players.female.length,l:"Nữ"},{v:tournaments.length,l:"Giải đấu"}].map((s,i)=>(
                  <div key={i} style={{textAlign:"center"}}>
                    <div style={{fontSize:20,fontWeight:900,color:C.orange}}>{s.v}</div>
                    <div style={{fontSize:10,color:C.dim,marginTop:1}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tier table */}
            <Card>
              <SectionTitle>🏅 Bảng phân hạng BOOM</SectionTitle>
              <div style={{display:"flex",flexDirection:"column",gap:0,borderRadius:10,overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"}}>
                {/* Header */}
                <div style={{display:"grid",gridTemplateColumns:"60px 1fr 70px 70px",background:"rgba(255,255,255,0.04)",padding:"8px 12px"}}>
                  {["Tier","Tên hạng","Nam","Nữ"].map((h,i)=>(
                    <div key={i} style={{fontSize:10,color:C.dim,fontWeight:700,textAlign:i>1?"center":"left"}}>{h}</div>
                  ))}
                </div>
                {[
                  {tier:"1+", name:"Cao thủ",   male:2.80, female:2.15},
                  {tier:"1-", name:"Tinh anh",  male:2.75, female:2.12},
                  {tier:"2++",name:"Xuất sắc",  male:2.70, female:null},
                  {tier:"2+", name:"Khá giỏi",  male:2.65, female:null},
                  {tier:"2",  name:"Trung bình",male:2.10, female:2.10},
                  {tier:"2-", name:"Cần cố gắng",male:2.05,female:2.05},
                  {tier:"3+", name:"Tập sự+",   male:2.55, female:null},
                  {tier:"3",  name:"Tập sự",    male:2.50, female:null},
                ].map((row,i,arr)=>(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"60px 1fr 70px 70px",padding:"9px 12px",background:i%2===0?"transparent":"rgba(255,255,255,0.015)",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
                    <div><span style={{fontSize:11,padding:"2px 7px",borderRadius:20,fontWeight:800,border:"1px solid "+TIER_COLORS[row.tier]+"55",background:TIER_COLORS[row.tier]+"18",color:TIER_COLORS[row.tier]}}>{row.tier}</span></div>
                    <div style={{fontSize:12,color:C.text,fontWeight:600,alignSelf:"center"}}>{row.name}</div>
                    <div style={{fontSize:12,color:"#60A5FA",fontWeight:700,textAlign:"center",alignSelf:"center"}}>{row.male.toFixed(2)}</div>
                    <div style={{fontSize:12,color:"#F9A8D4",fontWeight:700,textAlign:"center",alignSelf:"center"}}>{row.female!=null?row.female.toFixed(2):"—"}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:10,color:C.dim,marginTop:10,lineHeight:1.6}}>
                💡 Điểm BOOM được cập nhật sau mỗi giải đấu chính thức. Điểm khởi điểm: Nam 2.50 · Nữ 2.10
              </div>
            </Card>

            {/* Rules */}
            <Card>
              <SectionTitle>📋 Quy định chung</SectionTitle>
              <div style={{display:"flex",flexDirection:"column",gap:0}}>
                {[
                  {num:"01", text:"VĐV mới đăng ký qua app và chờ Admin xét duyệt trước khi được vào hệ thống."},
                  {num:"02", text:"Điểm BOOM chỉ được điều chỉnh bởi Admin/Mod sau giải đấu có kiểm soát."},
                  {num:"03", text:"Mọi thay đổi điểm đều được lưu lịch sử — có thể tra cứu bất kỳ lúc nào."},
                  {num:"04", text:"Đăng ký thi đấu cần được duyệt trước khi tham gia. Vui lòng đăng ký đúng hạn."},
                  {num:"05", text:"Trọng tài dùng mã PIN giải đấu để nhập điểm trực tiếp lên hệ thống."},
                  {num:"06", text:"Tinh thần thể thao là trên hết — tôn trọng đối thủ và quyết định của trọng tài."},
                ].map((r,i,arr)=>(
                  <div key={i} style={{display:"flex",gap:12,padding:"11px 0",borderBottom:i!==arr.length-1?"1px solid rgba(255,255,255,0.05)":"none",alignItems:"flex-start"}}>
                    <span style={{fontSize:11,fontWeight:900,color:C.orange,flexShrink:0,width:24,height:24,borderRadius:"50%",background:"rgba(255,107,53,0.12)",display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>{r.num}</span>
                    <span style={{fontSize:13,color:C.muted,lineHeight:1.6}}>{r.text}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Contact */}
            <Card style={{background:"rgba(255,107,53,0.05)",border:"1px solid rgba(255,107,53,0.2)"}}>
              <SectionTitle>📞 Liên hệ</SectionTitle>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[
                  {icon:"📍",label:"Địa điểm","value":"Đà Nẵng, Việt Nam"},
                  {icon:"📘",label:"Fanpage","value":"facebook.com/pickleboomdn"},
                  {icon:"✉️",label:"Email","value":"pickleboom@gmail.com"},
                ].map((c,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:16,flexShrink:0,width:28,textAlign:"center"}}>{c.icon}</span>
                    <div>
                      <div style={{fontSize:10,color:C.dim,fontWeight:600}}>{c.label}</div>
                      <div style={{fontSize:13,color:C.text,fontWeight:600,marginTop:1}}>{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>

      {playerHistoryView&&(()=>{
        const ps=getPlayerStats(playerHistoryView);
        const pl=allPlayers.find(p=>p.name===playerHistoryView);
        return(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:210,animation:"fadeIn 0.2s ease"}} onClick={()=>setPlayerHistoryView(null)}>
          <div onClick={e=>e.stopPropagation()} style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"88vh",display:"flex",flexDirection:"column",border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.15)",borderRadius:4,margin:"12px auto 0",flexShrink:0}}/>
            {/* Header */}
            <div style={{padding:"14px 20px 0",flexShrink:0}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <div>
                  <div style={{fontWeight:900,fontSize:16,color:C.text}}>{playerHistoryView}</div>
                  {pl&&<div style={{display:"flex",gap:6,marginTop:5,alignItems:"center",flexWrap:"wrap"}}><TierChip tier={pl.tier}/><BoomBadge boom={pl.boom} tier={pl.tier}/><span style={{fontSize:10,color:C.dim}}>{pl.gender==="male"?"♂ Nam":"♀ Nữ"}</span>{pl.phone&&<span style={{fontSize:11,color:C.muted,background:"rgba(255,255,255,0.06)",borderRadius:6,padding:"1px 7px"}}>📱 {pl.phone}</span>}</div>}
                </div>
                <button onClick={()=>setPlayerHistoryView(null)} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:C.muted,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:13,fontWeight:700}}>✕ Đóng</button>
              </div>
              {/* Stats grid */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
                {[{label:"Trận",v:ps.totalMatches,c:C.orange},{label:"Thắng",v:ps.wins,c:"#4ADE80"},{label:"Thua",v:ps.losses,c:"#EF4444"},{label:"Tỉ lệ",v:ps.winRate+"%",c:"#60A5FA"}].map((s,i)=>(
                  <div key={i} style={{textAlign:"center",padding:"12px 4px",borderRadius:12,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
                    <div style={{fontSize:22,fontWeight:900,color:s.c,lineHeight:1}}>{s.v}</div>
                    <div style={{fontSize:10,color:C.dim,marginTop:4}}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Match list */}
            <div style={{overflowY:"auto",flex:1,padding:"0 20px 24px"}}>
              {ps.matchHistory.length?(
                <div>
                  <div style={{fontSize:11,color:C.muted,fontWeight:700,marginBottom:10}}>Lịch sử thi đấu ({ps.matchHistory.length} trận)</div>
                  {ps.matchHistory.map((m,i,arr)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:i!==arr.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
                      <div style={{width:32,height:32,borderRadius:9,background:m.won?"rgba(74,222,128,0.15)":m.drew?"rgba(251,191,36,0.1)":"rgba(239,68,68,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:m.won?"#4ADE80":m.drew?"#FBbF24":"#EF4444",flexShrink:0,border:"1px solid "+(m.won?"rgba(74,222,128,0.3)":m.drew?"rgba(251,191,36,0.2)":"rgba(239,68,68,0.25)")}}>
                        {m.won?"W":m.drew?"D":"L"}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:700,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.opponent||"?"}</div>
                        <div style={{fontSize:10,color:C.dim,marginTop:2}}>{m.tourName} · Round {m.round} · {m.tourDate}</div>
                      </div>
                      <div style={{fontWeight:900,fontSize:16,color:m.won?"#4ADE80":m.drew?"#FBbF24":"#EF4444",flexShrink:0}}>{m.myScore}–{m.oppScore}</div>
                    </div>
                  ))}
                </div>
              ):(
                <div style={{textAlign:"center",padding:"40px 0"}}>
                  <div style={{fontSize:36,marginBottom:10}}>🏓</div>
                  <div style={{color:C.dim,fontSize:13}}>Chưa có trận đấu nào</div>
                </div>
              )}
            </div>
          </div>
        </div>
        );
      })()}

      {showRegModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:200,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"92vh",display:"flex",flexDirection:"column",border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.15)",borderRadius:4,margin:"12px auto 0",flexShrink:0}}/>
            <div style={{padding:"12px 20px 0",flexShrink:0}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <div style={{fontWeight:800,fontSize:16,color:"#60A5FA"}}>📝 Đăng ký thành viên</div>
                <button onClick={()=>{setShowRegModal(false);setRegSubmitted(false);}} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:C.muted,borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:13,fontWeight:700}}>✕ Đóng</button>
              </div>
            </div>
            <div style={{overflowY:"auto",flex:1,padding:"0 20px 24px"}}>
              {!regSubmitted?(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <input placeholder="Pickleball Name *" value={regForm.name} onChange={e=>setRegForm(f=>({...f,name:e.target.value}))} style={MS}/>
                  <div style={{position:"relative"}}>
                    <input placeholder="Số điện thoại *" value={regForm.phone} onChange={e=>{
                      const phone=e.target.value.trim();
                      setRegForm(f=>({...f,phone:e.target.value}));
                    }} style={{...MS,borderColor:regForm.phone&&allPlayers.find(p=>p.phone===regForm.phone.trim())?"#EF4444":regForm.phone&&regList.find(r=>r.phone===regForm.phone.trim()&&r.status==="pending")?"#FBbF24":undefined}} inputMode="tel" autoComplete="tel"/>
                    {regForm.phone&&(()=>{
                      const dup=allPlayers.find(p=>p.phone===regForm.phone.trim());
                      const dupReg=!dup&&regList.find(r=>r.phone===regForm.phone.trim()&&r.status==="pending");
                      if(dup) return <div style={{fontSize:11,color:"#EF4444",marginTop:4,fontWeight:600}}>⚠️ SĐT đã có trong hệ thống: {dup.name}</div>;
                      if(dupReg) return <div style={{fontSize:11,color:"#FBbF24",marginTop:4,fontWeight:600}}>⏳ SĐT đang chờ duyệt: {dupReg.name}</div>;
                      return null;
                    })()}
                  </div>
                  <select value={regForm.gender} onChange={e=>setRegForm(f=>({...f,gender:e.target.value}))} style={MS}>
                    <option value="male">♂ Nam</option><option value="female">♀ Nữ</option>
                  </select>
                  <input placeholder="Email (tùy chọn)" value={regForm.email} onChange={e=>setRegForm(f=>({...f,email:e.target.value}))} style={MS}/>
                  <input placeholder="Điểm trình PVNA (tùy chọn)" value={regForm.pvna} onChange={e=>setRegForm(f=>({...f,pvna:e.target.value}))} style={MS}/>
                  <input placeholder="Ghi chú (tùy chọn)" value={regForm.note} onChange={e=>setRegForm(f=>({...f,note:e.target.value}))} style={MS}/>
                  <button onClick={handleRegister} disabled={regLoading||!!allPlayers.find(p=>p.phone===regForm.phone.trim())} style={{background:"linear-gradient(90deg,#60A5FA,#3B82F6)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700,boxShadow:"0 4px 12px rgba(96,165,250,0.3)",opacity:(regLoading||!!allPlayers.find(p=>p.phone===regForm.phone.trim()))?0.5:1,marginTop:4}}>
                    {regLoading?"Đang gửi...":"📝 Gửi đăng ký"}
                  </button>
                  {isAdmin&&can("canApproveReg")&&!!regList.length&&(
                    <div style={{marginTop:8}}>
                      <div style={{fontSize:12,color:C.muted,fontWeight:600,marginBottom:8}}>Danh sách đăng ký ({regList.length})</div>
                      {regList.map((r,i)=>(
                        <div key={r.id||i} style={{padding:"10px 0",borderBottom:i!==regList.length-1?"1px solid rgba(255,255,255,0.05)":"none"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontWeight:700,fontSize:13,color:C.text}}>{r.name} <span style={{color:r.gender==="male"?"#60A5FA":"#F9A8D4",fontSize:11}}>{r.gender==="male"?"♂":"♀"}</span></div>
                              {r.phone&&<div style={{fontSize:11,color:"#60A5FA"}}>📱 {r.phone}</div>}
                          <div style={{fontSize:11,color:C.muted}}>{r.email&&r.email+" · "}{r.pvna&&"PVNA: "+r.pvna}</div>
                              <div style={{fontSize:10,color:C.dim,marginTop:2}}>🕐 {r.time}</div>
                            </div>
                            <span style={{fontSize:10,padding:"3px 8px",borderRadius:10,fontWeight:700,background:r.status==="approved"?"rgba(74,222,128,0.15)":r.status==="rejected"?"rgba(239,68,68,0.15)":"rgba(251,191,36,0.15)",color:r.status==="approved"?"#4ADE80":r.status==="rejected"?"#EF4444":"#FBbF24",flexShrink:0}}>{r.status==="approved"?"✓ Duyệt":r.status==="rejected"?"✗ Từ chối":"⏳ Chờ"}</span>
                          </div>
                          {r.status==="pending"&&(
                            <div style={{display:"flex",gap:8,marginTop:8}}>
                              <button onClick={()=>handleApproveReg(r)} style={{flex:1,background:"rgba(74,222,128,0.12)",border:"1px solid rgba(74,222,128,0.35)",color:"#4ADE80",borderRadius:8,padding:"7px",cursor:"pointer",fontSize:12,fontWeight:700}}>✓ Duyệt</button>
                              <button onClick={()=>handleRejectReg(r)} style={{flex:1,background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.35)",color:"#EF4444",borderRadius:8,padding:"7px",cursor:"pointer",fontSize:12,fontWeight:700}}>✗ Từ chối</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ):(
                <div style={{textAlign:"center",padding:"32px 0"}}>
                  <div style={{fontSize:48,marginBottom:12}}>✅</div>
                  <div style={{fontSize:16,fontWeight:700,color:"#4ADE80",marginBottom:8}}>Đã gửi đăng ký!</div>
                  <div style={{fontSize:13,color:C.muted,marginBottom:20}}>Chúng tôi sẽ xem xét và liên hệ qua email.</div>
                  <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                    <button onClick={()=>setRegSubmitted(false)} style={{background:"rgba(96,165,250,0.12)",border:"1px solid rgba(96,165,250,0.35)",color:"#60A5FA",borderRadius:10,padding:"10px 20px",cursor:"pointer",fontSize:13,fontWeight:700}}>Đăng ký thêm</button>
                    <button onClick={()=>{setShowRegModal(false);setRegSubmitted(false);}} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"10px 20px",cursor:"pointer",fontSize:13,fontWeight:700}}>Đóng</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddModal&&can("canAddPlayers")&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",zIndex:200,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle>➕ Thêm VĐV mới</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input placeholder="Họ tên *" value={newPlayer.name} onChange={e=>setNewPlayer(p=>({...p,name:e.target.value}))} style={MS}/>
              <div style={{display:"flex",gap:8}}>
                <select value={newPlayer.tier} onChange={e=>setNewPlayer(p=>({...p,tier:e.target.value}))} style={{...MS,flex:1}}>
                  {TIERS.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
                <select value={newPlayer.gender} onChange={e=>setNewPlayer(p=>({...p,gender:e.target.value}))} style={{...MS,flex:1}}>
                  <option value="male">♂ Nam</option><option value="female">♀ Nữ</option>
                </select>
              </div>
              <input placeholder="📱 Số điện thoại (tùy chọn)" value={newPlayer.phone} onChange={e=>setNewPlayer(p=>({...p,phone:e.target.value}))} style={MS} inputMode="tel"/>
              <input placeholder="Ghi chú (tùy chọn)" value={newPlayer.remark} onChange={e=>setNewPlayer(p=>({...p,remark:e.target.value}))} style={MS}/>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setShowAddModal(false)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                <button onClick={handleAddPlayer} style={{flex:2,background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Thêm VĐV</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {adjModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",zIndex:200,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle>⚡ Điều chỉnh điểm: {adjModal.name}</SectionTitle>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,padding:"10px 14px",borderRadius:10,background:"rgba(255,107,53,0.06)",border:"1px solid rgba(255,107,53,0.2)"}}>
              <TierChip tier={adjModal.tier}/>
              <span style={{fontWeight:700,fontSize:14}}>{adjModal.name}</span>
              <BoomBadge boom={adjModal.boom} tier={adjModal.tier}/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <select value={adjForm.type} onChange={e=>setAdjForm(f=>({...f,type:e.target.value}))} style={MS}>
                <option value="">Loại điều chỉnh</option>
                <option value="Vô địch giải">🥇 Vô địch giải</option>
                <option value="Á quân giải">🥈 Á quân giải</option>
                <option value="Hạng 3 giải">🥉 Hạng 3 giải</option>
                <option value="Thăng Tier">⬆️ Thăng Tier</option>
                <option value="Hạ Tier">⬇️ Hạ Tier</option>
                <option value="Điều chỉnh thủ công">✏️ Thủ công</option>
              </select>
              <input type="number" placeholder="Giá trị (+/-)" value={adjForm.value} onChange={e=>setAdjForm(f=>({...f,value:e.target.value}))} style={MS} step="0.01"/>
              <input placeholder="Ghi chú" value={adjForm.note} onChange={e=>setAdjForm(f=>({...f,note:e.target.value}))} style={MS}/>
              <div style={{fontSize:12,color:C.muted,textAlign:"center"}}>
                Điểm mới: <strong style={{color:C.orange}}>{(adjModal.boom+(parseFloat(adjForm.value)||0)).toFixed(3)}</strong>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setAdjModal(null)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                <button onClick={handleAdjust} style={{flex:2,background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Lưu điều chỉnh</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",zIndex:200,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle>✏️ Sửa VĐV: {editModal.name}</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input placeholder="Họ tên" value={editForm.name} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))} style={MS}/>
              <div style={{display:"flex",gap:8}}>
                <select value={editForm.tier} onChange={e=>setEditForm(f=>({...f,tier:e.target.value}))} style={{...MS,flex:1}}>
                  {TIERS.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
                <select value={editForm.gender} onChange={e=>setEditForm(f=>({...f,gender:e.target.value}))} style={{...MS,flex:1}}>
                  <option value="male">♂ Nam</option><option value="female">♀ Nữ</option>
                </select>
              </div>
              <input placeholder="📱 Số điện thoại" value={editForm.phone} onChange={e=>setEditForm(f=>({...f,phone:e.target.value}))} style={MS} inputMode="tel"/>
              <input placeholder="Ghi chú" value={editForm.remark} onChange={e=>setEditForm(f=>({...f,remark:e.target.value}))} style={MS}/>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setEditModal(null)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                <button onClick={handleEditPlayer} style={{flex:2,background:"linear-gradient(90deg,#60A5FA,#3B82F6)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Lưu thay đổi</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:18,width:"100%",maxWidth:340,padding:24,border:"1px solid rgba(239,68,68,0.3)"}}>
            <div style={{fontSize:36,textAlign:"center",marginBottom:12}}>🗑️</div>
            <div style={{fontWeight:800,fontSize:16,textAlign:"center",marginBottom:8}}>Xóa VĐV?</div>
            <div style={{fontSize:13,color:C.muted,textAlign:"center",marginBottom:20}}>Bạn có chắc chắn muốn xóa <strong style={{color:C.orange}}>{deleteConfirm.name}</strong>?</div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setDeleteConfirm(null)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
              <button onClick={()=>handleDeletePlayer(deleteConfirm)} style={{flex:1,background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.4)",color:"#EF4444",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Xóa</button>
            </div>
          </div>
        </div>
      )}

      {auth.showLogin&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:200,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle>🔑 Đăng nhập Admin</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input placeholder="Tên đăng nhập" value={auth.u} onChange={e=>setAuth(a=>({...a,u:e.target.value}))} style={MS} autoCapitalize="none"/>
              <input placeholder="Mật khẩu" type="password" value={auth.p} onChange={e=>setAuth(a=>({...a,p:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={MS}/>
              {auth.err&&<div style={{color:"#EF4444",fontSize:12,textAlign:"center"}}>{auth.err}</div>}
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setAuth(a=>({...a,showLogin:false,err:"",u:"",p:""}))} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                <button onClick={handleLogin} style={{flex:2,background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Đăng nhập</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTourModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:200,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"80vh",overflowY:"auto",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle>🏅 Tạo giải đấu mới</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input placeholder="Tên giải *" value={tourForm.name} onChange={e=>setTourForm(f=>({...f,name:e.target.value}))} style={MS}/>
              <input type="date" value={tourForm.date} onChange={e=>setTourForm(f=>({...f,date:e.target.value}))} style={MS}/>
              <select value={tourForm.format} onChange={e=>setTourForm(f=>({...f,format:e.target.value}))} style={MS}>
                <option value="single">Đơn</option><option value="double">Đôi</option><option value="mixed">Hỗn hợp</option>
              </select>
              <div style={{display:"flex",gap:8}}>
                <select value={tourForm.rounds} onChange={e=>setTourForm(f=>({...f,rounds:e.target.value}))} style={{...MS,flex:1}}>
                  {[1,2,3,4,5,6,8].map(n=><option key={n} value={n}>{n} vòng</option>)}
                </select>
                <select value={tourForm.bestOf} onChange={e=>setTourForm(f=>({...f,bestOf:e.target.value}))} style={{...MS,flex:1}}>
                  <option value="1">Best of 1</option><option value="3">Best of 3</option><option value="5">Best of 5</option>
                </select>
              </div>
              <input placeholder="Mã PIN trọng tài (tự động nếu trống)" value={tourForm.pin} onChange={e=>setTourForm(f=>({...f,pin:e.target.value}))} style={MS}/>
              <input placeholder="Ghi chú (tùy chọn)" value={tourForm.note} onChange={e=>setTourForm(f=>({...f,note:e.target.value}))} style={MS}/>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setShowTourModal(false)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                <button onClick={handleCreateTour} style={{flex:2,background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Tạo giải</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editTourModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:202,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"80vh",overflowY:"auto",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle>✏️ Sửa giải: {editTourModal.tour.name}</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input placeholder="Tên giải *" value={editTourModal.form.name} onChange={e=>setEditTourModal(m=>({...m,form:{...m.form,name:e.target.value}}))} style={MS}/>
              <input type="date" value={editTourModal.form.date} onChange={e=>setEditTourModal(m=>({...m,form:{...m.form,date:e.target.value}}))} style={MS}/>
              <select value={editTourModal.form.format} onChange={e=>setEditTourModal(m=>({...m,form:{...m.form,format:e.target.value}}))} style={MS}>
                <option value="single">Đơn</option><option value="double">Đôi</option><option value="mixed">Hỗn hợp</option>
              </select>
              <div style={{display:"flex",gap:8}}>
                <select value={editTourModal.form.rounds} onChange={e=>setEditTourModal(m=>({...m,form:{...m.form,rounds:e.target.value}}))} style={{...MS,flex:1}}>
                  {[1,2,3,4,5,6,8].map(n=><option key={n} value={n}>{n} vòng</option>)}
                </select>
                <select value={editTourModal.form.bestOf} onChange={e=>setEditTourModal(m=>({...m,form:{...m.form,bestOf:e.target.value}}))} style={{...MS,flex:1}}>
                  <option value="1">Best of 1</option><option value="3">Best of 3</option><option value="5">Best of 5</option>
                </select>
              </div>
              <input placeholder="Mã PIN trọng tài" value={editTourModal.form.pin} onChange={e=>setEditTourModal(m=>({...m,form:{...m.form,pin:e.target.value}}))} style={MS}/>
              <input placeholder="Ghi chú" value={editTourModal.form.note} onChange={e=>setEditTourModal(m=>({...m,form:{...m.form,note:e.target.value}}))} style={MS}/>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setEditTourModal(null)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                <button onClick={handleUpdateTour} style={{flex:2,background:"linear-gradient(90deg,#60A5FA,#3B82F6)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Lưu thay đổi</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMatchModal&&activeTour&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:202,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"85vh",overflowY:"auto",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle>🏓 Thêm kết quả trận</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <select value={matchForm.round} onChange={e=>setMatchForm(f=>({...f,round:e.target.value}))} style={MS}>
                {Array.from({length:activeTour.rounds||1},(_,i)=><option key={i+1} value={i+1}>Vòng {i+1}</option>)}
              </select>
              <div style={{display:"flex",gap:8}}>
                <input placeholder={activeTour.format==="double"?"Đội 1 - P1":"Người chơi 1"} value={matchForm.p1} onChange={e=>setMatchForm(f=>({...f,p1:e.target.value}))} style={{...MS,flex:1}}/>
                {activeTour.format==="double"&&<input placeholder="Đội 1 - P2" value={matchForm.p2} onChange={e=>setMatchForm(f=>({...f,p2:e.target.value}))} style={{...MS,flex:1}}/>}
              </div>
              <div style={{textAlign:"center",fontSize:13,color:C.dim,fontWeight:700}}>VS</div>
              <div style={{display:"flex",gap:8}}>
                <input placeholder={activeTour.format==="double"?"Đội 2 - P1":"Người chơi 2"} value={matchForm.p3} onChange={e=>setMatchForm(f=>({...f,p3:e.target.value}))} style={{...MS,flex:1}}/>
                {activeTour.format==="double"&&<input placeholder="Đội 2 - P2" value={matchForm.p4} onChange={e=>setMatchForm(f=>({...f,p4:e.target.value}))} style={{...MS,flex:1}}/>}
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="number" placeholder="Điểm Đội 1" value={matchForm.score1} onChange={e=>setMatchForm(f=>({...f,score1:e.target.value}))} style={{...MS,flex:1,textAlign:"center"}} min="0"/>
                <span style={{color:C.dim,fontWeight:800,fontSize:18,flexShrink:0}}>-</span>
                <input type="number" placeholder="Điểm Đội 2" value={matchForm.score2} onChange={e=>setMatchForm(f=>({...f,score2:e.target.value}))} style={{...MS,flex:1,textAlign:"center"}} min="0"/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setShowMatchModal(false)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                <button onClick={handleAddMatch} style={{flex:2,background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Lưu kết quả</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTourRegForm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"flex-end",zIndex:220,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"90vh",overflowY:"auto",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.15)",borderRadius:4,margin:"0 auto 16px"}}/>
            {!tourRegSubmitted?(
              <div>
                <div style={{marginBottom:16}}>
                  <div style={{fontWeight:900,fontSize:16,color:C.orange,marginBottom:4}}>📝 Đăng ký thi đấu</div>
                  <div style={{fontSize:12,color:C.dim,padding:"8px 12px",borderRadius:8,background:"rgba(255,107,53,0.06)",border:"1px solid rgba(255,107,53,0.2)"}}>
                    🏅 {showTourRegForm.name} · 📅 {showTourRegForm.date} · 🎮 {showTourRegForm.format==="single"?"Đơn":showTourRegForm.format==="double"?"Đôi":"Hỗn hợp"}
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{position:"relative"}}>
                    <div style={{fontSize:11,color:C.muted,marginBottom:5,fontWeight:600}}>Họ tên VĐV *</div>
                    <input
                      placeholder="Tìm tên VĐV trong hệ thống..."
                      value={tourRegForm.playerName}
                      onChange={e=>{setTourRegForm(f=>({...f,playerName:e.target.value}));setRegPlayerFocus(true);}}
                      onFocus={()=>setRegPlayerFocus(true)}
                      onBlur={()=>setTimeout(()=>setRegPlayerFocus(false),180)}
                      style={{...MS}}
                      autoComplete="off"
                    />
                    {regPlayerFocus&&(
                      <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:999,background:"#1e1e1e",border:"1px solid "+C.border,borderRadius:10,maxHeight:200,overflowY:"auto",boxShadow:"0 8px 24px rgba(0,0,0,0.6)",marginTop:4}}>
                        {allPlayers
                          .filter(p=>!tourRegForm.playerName||p.name.toLowerCase().includes(tourRegForm.playerName.toLowerCase()))
                          .slice(0,20)
                          .map(p=>(
                          <div key={p.id} onMouseDown={()=>{setTourRegForm(f=>({...f,playerName:p.name}));setRegPlayerFocus(false);}}
                            style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.05)",transition:"background 0.1s"}}
                            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,107,53,0.1)"}
                            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                            <span style={{fontSize:12,color:p.gender==="male"?"#60A5FA":"#F9A8D4",flexShrink:0}}>{p.gender==="male"?"♂":"♀"}</span>
                            <span style={{flex:1,fontSize:14,fontWeight:600,color:C.text}}>{p.name}</span>
                            <TierChip tier={p.tier}/>
                            <BoomBadge boom={p.boom} tier={p.tier}/>
                          </div>
                        ))}
                        {allPlayers.filter(p=>!tourRegForm.playerName||p.name.toLowerCase().includes(tourRegForm.playerName.toLowerCase())).length===0&&(
                          <div style={{padding:"12px 14px",fontSize:13,color:C.dim,textAlign:"center"}}>Không tìm thấy VĐV</div>
                        )}
                      </div>
                    )}
                  </div>
                  {showTourRegForm.format!=="single"&&(
                    <div>
                      <div style={{fontSize:11,color:C.muted,marginBottom:5,fontWeight:600}}>Hình thức đăng ký</div>
                      <div style={{display:"flex",gap:8}}>
                        {["single","double"].map(ct=>(
                          <button key={ct} onClick={()=>setTourRegForm(f=>({...f,content:ct,partner:ct==="single"?"":f.partner}))}
                            style={{flex:1,padding:"10px",borderRadius:10,border:"1px solid "+(tourRegForm.content===ct?C.orange:"rgba(255,255,255,0.12)"),background:tourRegForm.content===ct?"rgba(255,107,53,0.12)":"transparent",color:tourRegForm.content===ct?C.orange:C.muted,cursor:"pointer",fontWeight:700,fontSize:13}}>
                            {ct==="single"?"🎾 Đánh đơn":"🎽 Đánh đôi"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {tourRegForm.content==="double"&&(
                    <div style={{position:"relative"}}>
                      <div style={{fontSize:11,color:C.muted,marginBottom:5,fontWeight:600}}>Tên đồng đội *</div>
                      <input
                        placeholder="Tìm tên đồng đội trong hệ thống..."
                        value={tourRegForm.partner}
                        onChange={e=>{setTourRegForm(f=>({...f,partner:e.target.value}));setRegPartnerFocus(true);}}
                        onFocus={()=>setRegPartnerFocus(true)}
                        onBlur={()=>setTimeout(()=>setRegPartnerFocus(false),180)}
                        style={{...MS}}
                        autoComplete="off"
                      />
                      {regPartnerFocus&&(
                        <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:999,background:"#1e1e1e",border:"1px solid "+C.border,borderRadius:10,maxHeight:200,overflowY:"auto",boxShadow:"0 8px 24px rgba(0,0,0,0.6)",marginTop:4}}>
                          {allPlayers
                            .filter(p=>p.name!==tourRegForm.playerName&&(!tourRegForm.partner||p.name.toLowerCase().includes(tourRegForm.partner.toLowerCase())))
                            .slice(0,20)
                            .map(p=>(
                            <div key={p.id} onMouseDown={()=>{setTourRegForm(f=>({...f,partner:p.name}));setRegPartnerFocus(false);}}
                              style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.05)",transition:"background 0.1s"}}
                              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,107,53,0.1)"}
                              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                              <span style={{fontSize:12,color:p.gender==="male"?"#60A5FA":"#F9A8D4",flexShrink:0}}>{p.gender==="male"?"♂":"♀"}</span>
                              <span style={{flex:1,fontSize:14,fontWeight:600,color:C.text}}>{p.name}</span>
                              <TierChip tier={p.tier}/>
                              <BoomBadge boom={p.boom} tier={p.tier}/>
                            </div>
                          ))}
                          {allPlayers.filter(p=>p.name!==tourRegForm.playerName&&(!tourRegForm.partner||p.name.toLowerCase().includes(tourRegForm.partner.toLowerCase()))).length===0&&(
                            <div style={{padding:"12px 14px",fontSize:13,color:C.dim,textAlign:"center"}}>Không tìm thấy VĐV</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <div style={{fontSize:11,color:C.muted,marginBottom:5,fontWeight:600}}>Ghi chú (tùy chọn)</div>
                    <input placeholder="Yêu cầu đặc biệt, hạng dự thi..." value={tourRegForm.note} onChange={e=>setTourRegForm(f=>({...f,note:e.target.value}))} style={{...MS}}/>
                  </div>
                  <div style={{fontSize:11,color:C.dim,padding:"8px 12px",borderRadius:8,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
                    ℹ️ Đăng ký sẽ được Admin/Mod xét duyệt. Bạn sẽ được thông báo kết quả.
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:4}}>
                    <button onClick={()=>{setShowTourRegForm(null);setTourRegSubmitted(false);}} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                    <button onClick={async()=>{
                      if(!tourRegForm.playerName.trim()){showNotif("Vui lòng nhập họ tên","err");return;}
                      if(tourRegForm.content==="double"&&!tourRegForm.partner.trim()){showNotif("Vui lòng nhập tên đồng đội","err");return;}
                      await handleTourRegister();
                    }} style={{flex:2,background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700,boxShadow:"0 4px 12px rgba(255,107,53,0.35)"}}>
                      📝 Gửi đăng ký
                    </button>
                  </div>
                </div>
              </div>
            ):(
              <div style={{textAlign:"center",padding:"32px 16px"}}>
                <div style={{fontSize:52,marginBottom:12}}>🎉</div>
                <div style={{fontSize:18,fontWeight:900,color:"#4ADE80",marginBottom:8}}>Đăng ký thành công!</div>
                <div style={{fontSize:13,color:C.muted,marginBottom:6,lineHeight:1.6}}>
                  Yêu cầu đăng ký của bạn đã được ghi nhận.
                </div>
                <div style={{fontSize:12,color:C.dim,padding:"10px 16px",borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",marginBottom:20,lineHeight:1.7}}>
                  🏅 <strong style={{color:C.orange}}>{showTourRegForm.name}</strong><br/>
                  📅 {showTourRegForm.date}<br/>
                  ⏳ Đang chờ Admin/Mod xét duyệt
                </div>
                <button onClick={()=>{setShowTourRegForm(null);setTourRegSubmitted(false);}} style={{background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"12px 32px",cursor:"pointer",fontSize:15,fontWeight:700}}>
                  Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showGroupDrawModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-end",zIndex:202,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"linear-gradient(145deg,#181818,#222)",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"85vh",overflowY:"auto",padding:20,border:"1px solid "+C.border}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:4,margin:"0 auto 16px"}}/>
            <SectionTitle>🎯 Chia bảng: {showGroupDrawModal.name}</SectionTitle>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{display:"flex",gap:8}}>
                <select value={groupConfig.numGroups} onChange={e=>setGroupConfig(c=>({...c,numGroups:parseInt(e.target.value)}))} style={{...MS,flex:1}}>
                  {[2,3,4].map(n=><option key={n} value={n}>{n} bảng</option>)}
                </select>
                <select value={groupConfig.seedBy} onChange={e=>setGroupConfig(c=>({...c,seedBy:e.target.value}))} style={{...MS,flex:1}}>
                  <option value="tier">Theo Tier</option><option value="random">Ngẫu nhiên</option>
                </select>
              </div>
              <div style={{fontSize:11,color:C.muted}}>{groupConfig.players.filter(p=>p.selected).length} người được chọn</div>
              <div style={{maxHeight:200,overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>
                {groupConfig.players.map((p,i)=>(
                  <div key={i} onClick={()=>setGroupConfig(c=>({...c,players:c.players.map((pl,pi)=>pi===i?{...pl,selected:!pl.selected}:pl)}))}
                    style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,cursor:"pointer",background:p.selected?"rgba(255,107,53,0.1)":"rgba(255,255,255,0.04)",border:"1px solid "+(p.selected?"rgba(255,107,53,0.3)":"rgba(255,255,255,0.08)")}}>
                    <span style={{fontSize:14}}>{p.selected?"✓":"○"}</span>
                    <span style={{fontSize:13,flex:1}}>{p.name}</span>
                    <span style={{fontSize:10,color:C.dim}}>{p.boom.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setShowGroupDrawModal(null)} style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:C.muted,borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>Hủy</button>
                <button onClick={handleGenerateGroups} style={{flex:2,background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"13px",cursor:"pointer",fontSize:15,fontWeight:700}}>🎯 Chia bảng</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {refMode&&(
        <div style={{position:"fixed",inset:0,background:"#0d0d0d",zIndex:999,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{background:"rgba(13,13,13,0.97)",borderBottom:"1px solid "+C.border,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontWeight:900,fontSize:16,color:C.orange}}>🏳️ Chế độ Trọng tài</div>
            <button onClick={()=>{setRefMode(false);setRefTour(null);setRefMatch(null);setRefGames([]);setRefConfirmed(false);}} style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.35)",color:"#EF4444",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:700}}>✕ Thoát</button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:16}}>
            {!refTour&&(
              <div style={{display:"flex",flexDirection:"column",gap:16,paddingTop:24}}>
                <div style={{textAlign:"center",fontSize:36,marginBottom:8}}>🔑</div>
                <div style={{textAlign:"center",fontWeight:700,fontSize:16,color:C.text}}>Nhập mã PIN giải đấu</div>
                <input placeholder="Mã PIN 4 chữ số" value={refPinInput} onChange={e=>setRefPinInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleRefPinSubmit()} style={{...MS,textAlign:"center",fontSize:24,letterSpacing:8,fontWeight:900}} maxLength={6} inputMode="numeric"/>
                {refPinErr&&<div style={{color:"#EF4444",fontSize:12,textAlign:"center"}}>{refPinErr}</div>}
                <button onClick={handleRefPinSubmit} style={{background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"14px",cursor:"pointer",fontSize:16,fontWeight:700}}>Xác nhận PIN</button>
              </div>
            )}
            {refTour&&!refMatch&&(
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div style={{fontWeight:800,fontSize:15,color:C.orange,marginBottom:4}}>{refTour.name}</div>
                <div style={{fontSize:12,color:C.dim,marginBottom:8}}>Chọn trận để nhập điểm:</div>
                {(refTour.matches||[]).map((m,i)=>(
                  <div key={m.id||i} onClick={()=>handleRefStartMatch(m)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid "+(m.confirmed?"rgba(74,222,128,0.3)":C.border),borderRadius:12,padding:"12px 14px",cursor:"pointer"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <span style={{fontSize:10,color:C.dim}}>R{m.round}</span>
                      {m.confirmed&&<span style={{fontSize:10,color:"#4ADE80",fontWeight:700}}>✓ Đã xác nhận</span>}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{flex:1,fontSize:13,fontWeight:600,textAlign:"right",color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(m.team1||[]).join(" & ")}</span>
                      <span style={{fontWeight:900,fontSize:16,color:C.orange,flexShrink:0,padding:"2px 10px",background:"rgba(255,107,53,0.1)",borderRadius:6}}>{m.score1} - {m.score2}</span>
                      <span style={{flex:1,fontSize:13,fontWeight:600,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(m.team2||[]).join(" & ")}</span>
                    </div>
                  </div>
                ))}
                {!(refTour.matches||[]).length&&<div style={{textAlign:"center",color:C.dim,padding:24}}>Chưa có trận đấu nào trong giải</div>}
              </div>
            )}
            {refTour&&refMatch&&(
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                  <button onClick={handleRefExitMatch} style={{background:"rgba(255,255,255,0.06)",border:"none",color:C.muted,borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:13}}>← Quay lại</button>
                  <div style={{fontWeight:800,fontSize:14,color:C.orange}}>Vòng {refMatch.round}</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:8,alignItems:"center",marginBottom:8}}>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontWeight:700,fontSize:14,color:C.text}}>{(refMatch.team1||[]).join(" & ")}</div>
                    <div style={{fontSize:22,fontWeight:900,color:C.orange,marginTop:4}}>{refGames.filter(g=>parseInt(g.t1)>parseInt(g.t2)).length}</div>
                  </div>
                  <div style={{textAlign:"center",fontSize:12,color:C.dim,fontWeight:700}}>VS</div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontWeight:700,fontSize:14,color:C.text}}>{(refMatch.team2||[]).join(" & ")}</div>
                    <div style={{fontSize:22,fontWeight:900,color:C.orange,marginTop:4}}>{refGames.filter(g=>parseInt(g.t2)>parseInt(g.t1)).length}</div>
                  </div>
                </div>
                {refGames.map((g,i)=>(
                  <div key={i} style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"12px 14px",border:"1px solid "+C.border}}>
                    <div style={{fontSize:11,color:C.dim,marginBottom:8,fontWeight:600}}>Ván {i+1}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:8,alignItems:"center"}}>
                      <input type="number" placeholder="0" value={g.t1} onChange={e=>setRefGames(gs=>gs.map((gx,xi)=>xi===i?{...gx,t1:e.target.value}:gx))} style={{...MS,textAlign:"center",fontSize:22,fontWeight:900,padding:"10px"}} min="0" inputMode="numeric"/>
                      <span style={{color:C.dim,fontWeight:800,fontSize:16}}>-</span>
                      <input type="number" placeholder="0" value={g.t2} onChange={e=>setRefGames(gs=>gs.map((gx,xi)=>xi===i?{...gx,t2:e.target.value}:gx))} style={{...MS,textAlign:"center",fontSize:22,fontWeight:900,padding:"10px"}} min="0" inputMode="numeric"/>
                    </div>
                  </div>
                ))}
                {refConfirmed&&<div style={{textAlign:"center",padding:12,borderRadius:10,background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.3)",color:"#4ADE80",fontWeight:700,fontSize:14}}>✓ Đã lưu kết quả!</div>}
                <button onClick={handleRefSaveMatch} style={{background:"linear-gradient(90deg,#FF6B35,#FF8C5A)",border:"none",color:"#fff",borderRadius:10,padding:"16px",cursor:"pointer",fontSize:16,fontWeight:700,boxShadow:"0 4px 16px rgba(255,107,53,0.4)"}}>
                  {refConfirmed?"🔄 Cập nhật lại":"💾 Xác nhận kết quả"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <nav style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(13,13,13,0.97)",borderTop:"1px solid "+C.border,display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom,0px)",boxShadow:"0 -4px 24px rgba(0,0,0,0.5)"}}>
        {NAV.filter(t=>!t.adminOnly||isAdmin).map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"10px 2px 7px",border:"none",background:"transparent",cursor:"pointer",color:tab===t.key?C.orange:C.dim,transition:"color 0.2s",position:"relative",minHeight:52}}>
            {tab===t.key&&<div style={{position:"absolute",top:0,left:"25%",right:"25%",height:2,background:C.orange,borderRadius:2}}/>}
            <span style={{fontSize:18,lineHeight:1}}>{t.icon}</span>
            <span style={{fontSize:"clamp(8px,2.2vw,10px)",fontWeight:tab===t.key?700:500,letterSpacing:0.2,whiteSpace:"nowrap"}}>{t.label}</span>
          </button>
        ))}
      </nav>


    </div>
    </>
  );
}