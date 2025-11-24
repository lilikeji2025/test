
import React from 'react';
import { UserProfile } from '../types';

interface UserProfileBarProps {
  profile: UserProfile;
  onChange: (profile: UserProfile) => void;
  isLocked: boolean;
}

const UserProfileBar: React.FC<UserProfileBarProps> = ({ profile, onChange, isLocked }) => {
  const handleChange = (key: keyof UserProfile, value: string) => {
    if (isLocked) return;
    onChange({ ...profile, [key]: value });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 md:gap-6 bg-slate-900/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5 mb-4 mx-4 md:mx-0">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase">MBTI</span>
        <select 
          value={profile.mbti} 
          onChange={(e) => handleChange('mbti', e.target.value)}
          disabled={isLocked}
          className="bg-slate-800 text-white text-sm rounded-lg px-2 py-1 border border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option value="">未选择</option>
          {['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase">年龄</span>
        <input 
          type="number"
          value={profile.age}
          onChange={(e) => handleChange('age', e.target.value)}
          disabled={isLocked}
          placeholder="25"
          className="bg-slate-800 text-white text-sm rounded-lg w-16 px-2 py-1 border border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase">性别</span>
        <select 
          value={profile.gender}
          onChange={(e) => handleChange('gender', e.target.value)}
          disabled={isLocked}
          className="bg-slate-800 text-white text-sm rounded-lg px-2 py-1 border border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option value="female">女</option>
          <option value="male">男</option>
          <option value="other">其他</option>
        </select>
      </div>
      
      {!profile.mbti && (
        <span className="hidden md:inline text-xs text-rose-400 animate-pulse ml-auto">
          * 请先完善个人信息以便AI分析
        </span>
      )}
    </div>
  );
};

export default UserProfileBar;
