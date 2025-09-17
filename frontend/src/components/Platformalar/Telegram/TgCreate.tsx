import React, { useState } from 'react';
import { Bot, MessageCircle, Settings, ExternalLink, Copy, CheckCircle, Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TgCreate = () => {
  const navigate = useNavigate();
  const [copiedToken, setCopiedToken] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const steps = [
    {
      id: 1,
      title: "Telegram qidiriv bo'limiga",
      highlight: "@BotFather",
      description: "deb yozing"
    },
    {
      id: 2,
      title: "/newbot",
      description: "buyrug'i yozilarida yangi bot yarating"
    },
    {
      id: 3,
      title: "Bot nomi va usernameini kiriting"
    },
    {
      id: 4,
      title: "Javob sifatida",
      highlight: "@BotFather",
      description: "sizga token yuboradi:",
      token: "2802996d:AAFEr-ZvCAE5JJRqESdLyqgeDJUhReo"
    },
    {
      id: 5,
      title: "Tokendan nusxa oling va uni yuqoridagi maydonaga joylashtiring"
    }
  ];

  return (
    <div className="mx-auto p-6 bg-white rounded-md">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Bot ugratish</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Steps */}
        <div className="lg:col-span-2">
          {/* Token Input Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Token</h2>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">
                Tokenni kiriting
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Bot tokenini shu yerga kiriting..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Info Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">i</span>
                </div>
                <div>
                  <p className="text-sm text-blue-800 font-medium mb-1">
                    To'g'rilama:
                  </p>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Telegram qidiriv bo'limiga <span className="font-mono bg-blue-100 px-1 rounded">@BotFather</span> deb yozing</li>
                    <li>2. <span className="font-mono bg-blue-100 px-1 rounded">/newbot</span> buyrug'i yozilarida yangi <span className="font-medium">bot yarating</span></li>
                    <li>3. Bot nomi va username kiriting</li>
                    <li>4. Javob sifatida <span className="font-mono bg-blue-100 px-1 rounded">@BotFather</span> sizga token yuboradi:
                      <div className="mt-2 p-2 bg-blue-100 rounded font-mono text-xs">
                        2802996d:AAFEr-ZvCAE5JJRqESdLyqgeDJUhReo
                      </div>
                    </li>
                    <li>5. Tokendan nusxa oling va uni yuqoridagi maydonaga joylashtiring</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Video Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Video qo'llanma ko'ring:
            </h3>

            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              {/* Video Thumbnail */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  <p className="text-white text-lg font-medium">Telegram Bot 2024...</p>
                  <p className="text-gray-300 text-sm">YouTube videosi</p>
                </div>
              </div>

              {/* Play Button Overlay */}
              <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-colors group">
                <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:bg-opacity-100 transition-colors">
                  <Play className="w-10 h-10 text-gray-900 ml-1" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tezkor harakatlar</h3>

            <div className="space-y-3">
              {/* Quick Links */}
              <a
                href="https://t.me/botfather"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">BotFather ochish</p>
                  <p className="text-sm text-gray-600">@BotFather</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </a>

              {/* Copy Token */}
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Namuna token</span>
                  <button
                    onClick={() => copyToClipboard("2802996d:AAFEr-ZvCAE5JJRqESdLyqgeDJUhReo")}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    {copiedToken ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Nusxalandi
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Nusxalash
                      </>
                    )}
                  </button>
                </div>
                <code className="text-xs bg-gray-100 p-2 rounded text-gray-700 block break-all">
                  2802996d:AAFEr-ZvCAE5JJRqESdLyqgeDJUhReo
                </code>
              </div>

              {/* Help Links */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Yordam</h4>
                <div className="space-y-2">
                  <a href="#" className="block text-sm text-gray-600 hover:text-gray-900">
                    📚 Bot yaratish qo'llanmasi
                  </a>
                  <a href="#" className="block text-sm text-gray-600 hover:text-gray-900">
                    ❓ Tez-tez so'raladigan savollar
                  </a>
                  <a href="#" className="block text-sm text-gray-600 hover:text-gray-900">
                    💬 Yordam chat
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
        <Button
          onClick={() => navigate("/dashboard/platforms/telegram")}
          variant="outline" className="px-4 py-2 text-sm border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          Bekor qilish
        </Button>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          Yuborish
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TgCreate;