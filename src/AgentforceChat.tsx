import { useEffect } from 'react';

// ============================================================
//  Agentforce Web チャット（Salesforce Messaging for In-App and Web）
//  値は Salesforce の「組み込みサービスリリース → SS_WebChat → コードスニペット」から転記する。
//  siteUrl が空のあいだは何も読み込まない（Salesforce 側の公開前でも安全にデプロイできる）。
// ============================================================
const CONFIG = {
  orgId: '00Dd500000Fup0n',
  deploymentName: 'SS_WebChat',
  siteUrl: 'https://s-and-s.my.site.com/ESWSSWebChat1789519790491',
  scrt2Url: 'https://s-and-s.my.salesforce-scrt.com',
};

declare global {
  interface Window {
    embeddedservice_bootstrap?: {
      settings: { language?: string };
      init: (orgId: string, deploymentName: string, siteUrl: string, options: { scrt2URL: string }) => void;
    };
  }
}

const SCRIPT_ID = 'agentforce-webchat-bootstrap';

export default function AgentforceChat() {
  useEffect(() => {
    if (!CONFIG.siteUrl || document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = `${CONFIG.siteUrl}/assets/js/bootstrap.min.js`;
    script.onload = () => {
      const esb = window.embeddedservice_bootstrap;
      if (!esb) return;
      try {
        // 初期表示の言語。会話中は Agent がお客様の書いた言語に合わせて応答する
        esb.settings.language = document.documentElement.lang === 'en' ? 'en_US' : 'ja';
        esb.init(CONFIG.orgId, CONFIG.deploymentName, CONFIG.siteUrl, { scrt2URL: CONFIG.scrt2Url });
      } catch (err) {
        console.error('Error loading Embedded Messaging: ', err);
      }
    };
    document.body.appendChild(script);
  }, []);

  return null;
}
