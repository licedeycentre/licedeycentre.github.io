import React from 'react'
import { Link } from 'react-router-dom'
import { useContacts, useSite, useUILabels } from '../hooks/useContent'
import { siTelegram, siTiktok, siVk } from 'simple-icons'

const Footer: React.FC = () => {
  const contactsData = useContacts()
  const siteData = useSite()
  const labels = useUILabels()

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-content">
          <div className="footer-blocks">
            {/* Блок 1: Адрес */}
            <div className="footer-block">
              <h4 className="footer-block-title">{labels.footer.addressTitle}</h4>
              <p className="footer-block-text">
                {contactsData.address}
                {contactsData.addressDetails && (
                  <>
                    <br />
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {contactsData.addressDetails}
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Блок 2: Телефоны */}
            <div className="footer-block">
              <h4 className="footer-block-title">{labels.footer.phonesTitle}</h4>
              <div className="footer-phones">
                {contactsData.phones.map((phone, index) => (
                  <div key={index} className="footer-phone-item">
                    <a href={phone.href} className="footer-phone">
                      {phone.number}
                    </a>
                    <div className="footer-messengers">
                      <a href={phone.telegram} target="_blank" rel="noopener noreferrer" className="footer-messenger-link">
                        Telegram
                      </a>
                      <a href={phone.whatsapp} target="_blank" rel="noopener noreferrer" className="footer-messenger-link">
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Блок 3: Email */}
            <div className="footer-block">
              <h4 className="footer-block-title">{labels.footer.emailTitle}</h4>
              <a href={contactsData.email.href} className="footer-email">
                {contactsData.email.text}
              </a>
            </div>

            {/* Блок 4: Социальные сети */}
            <div className="footer-block">
              <h4 className="footer-block-title">{labels.footer.socialTitle}</h4>
              <div className="footer-socials">
                {contactsData.socials.map((social, index) => {
                  const iconMap: { [key: string]: { path: string } } = {
                    siTelegram: siTelegram,
                    siTiktok: siTiktok,
                    siVk: siVk,
                  }
                  const iconData = iconMap[social.icon]
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className="footer-social"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d={iconData?.path} />
                      </svg>
                      <span>{social.name}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-org">{siteData.footer.copyright}</p>
            <div className="footer-legal-links-inline">
              <Link to="/privacy-policy" className="footer-legal-link">
                Политика конфиденциальности
              </Link>
              <span className="footer-separator">•</span>
              <span className="footer-photo-info">{siteData.footer.photoConsent}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
