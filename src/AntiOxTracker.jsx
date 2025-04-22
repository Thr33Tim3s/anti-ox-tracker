import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  '户外自然阳光15分钟 +1分'
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
    <div className="min-h-screen bg-gray-50 px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center text-purple-700 mb-2">抗氧生活打卡</h1>
        <p className="text-center text-sm text-gray-500 mb-6">今天是 {today}</p>

        <div className="space-y-3">
          {tasks.map((task, index) => (
            <Card key={index} className="shadow-sm">
              <CardContent className="flex items-center gap-4 py-4 px-2">
                <Checkbox checked={checkedItems[index]} onCheckedChange={() => toggleItem(index)} />
                <span className="text-base text-gray-800">{task}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-6">
          <Button variant="outline" onClick={() => setCheckedItems(Array(tasks.length).fill(false))}>
            重置打卡
          </Button>
        </div>

        <div className="mt-12 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-center">📈 打卡趋势图</h2>
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
    </div>
  );
}