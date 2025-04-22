
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const tasks = [
  '吃3种以上彩色蔬果',
  '吃1次健康脂肪食物（坚果/橄榄油等）',
  '喝无糖茶/柠檬水',
  '睡满7小时',
  '睡前1小时不刷手机，做放松事',
  '冥想/深呼吸/写感恩日记',
  '运动30分钟（快走/瑜伽/舞蹈）',
  '不吸烟、不喝酒、不熬夜',
  '不吃油炸/加工食物',
  '吃超级抗氧食物（蓝莓/姜黄等）+1分',
  '晚餐早于7:30 +1分',
  '户外自然/阳光15分钟 +1分'
];

const STORAGE_KEY = 'antiOxCheckin';

export default function AntiOxTracker() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [checkedItems, setCheckedItems] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed[today] || Array(tasks.length).fill(false);
    }
    return Array(tasks.length).fill(false);
  });

  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  const toggleItem = (index) => {
    const updated = [...checkedItems];
    updated[index] = !updated[index];
    setCheckedItems(updated);
  };

  useEffect(() => {
    const updatedHistory = {
      ...history,
      [today]: checkedItems
    };
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  }, [checkedItems]);

  const chartData = Object.entries(history).map(([date, items]) => ({
    date,
    score: items.filter(Boolean).length
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">抗氧生活打卡</h1>
      <p className="text-center text-sm mb-6">今天是 {today}</p>
      {tasks.map((task, index) => (
        <Card key={index} className="mb-2">
          <CardContent className="flex items-center space-x-3 py-3">
            <Checkbox checked={checkedItems[index]} onCheckedChange={() => toggleItem(index)} />
            <span className="text-base">{task}</span>
          </CardContent>
        </Card>
      ))}
      <div className="text-center mt-6">
        <Button onClick={() => setCheckedItems(Array(tasks.length).fill(false))}>重置打卡</Button>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">🧾 打卡趋势图</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, tasks.length]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
