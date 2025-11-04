import React, { useState } from 'react'
import { useContacts } from '../hooks/useContent'
import PageLayout from '../components/PageLayout'
import { MapPin, Phone, Mail, Users } from 'lucide-react'
import { siTelegram, siTiktok, siVk, siWhatsapp } from 'simple-icons'

const ContactsPage: React.FC = () => {
  const contactsData = useContacts()
  const [formError, setFormError] = useState(false)

  return (
    <PageLayout
      title="Контакты — Лицедей"
      description="Контактная информация театра-студии 'Балаганчик' во Владивостоке. Адрес, телефоны, email, социальные сети. Как добраться."
      keywords="контакты, адрес, телефон, Владивосток, театр, Балаганчик, как добраться"
      breadcrumbs={[{ label: 'Главная', href: '/' }, { label: 'Контакты' }]}
      centered={false}
    >
      {/* Контактная информация в двухколоночной сетке */}
      <div className="content-card">
        <div className="readable-content">
          <h2>Контактная информация</h2>
        </div>
        <div className="contacts-info-grid">
          {/* Левая колонка: телефоны, email, соцсети */}
          <div className="contacts-info-left">
            <div className="contact-item">
              <div className="contact-info-icon">
                <Phone size={18} />
              </div>
              <div className="contact-info-content">
                <div className="contact-info-label">Телефоны</div>
                <div className="contact-info-value">
                  {contactsData.phones?.map((phone, index) => (
                    <div key={index} className="phone-item">
                      <div className="phone-info">
                        <a href={phone.href} className="contact-link">
                          {phone.number}
                        </a>
                        <div className="phone-messengers">
                          <a
                            href={phone.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="messenger-btn telegram-btn"
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                              <path d={siTelegram.path} />
                            </svg>
                            Telegram
                          </a>
                          <a
                            href={phone.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="messenger-btn whatsapp-btn"
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                              <path d={siWhatsapp.path} />
                            </svg>
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-info-icon">
                <Mail size={18} />
              </div>
              <div className="contact-info-content">
                <div className="contact-info-label">Email</div>
                <div className="contact-info-value">
                  <a href={contactsData.email?.href} className="contact-link">
                    {contactsData.email?.text}
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-info-icon">
                <Users size={18} />
              </div>
              <div className="contact-info-content">
                <div className="contact-info-label">Соцсети</div>
                <div className="contact-info-value">
                  <div className="contact-socials">
                    {contactsData.socials?.map((social, index) => {
                      const iconMap: { [key: string]: { path: string } } = {
                        siTelegram: siTelegram,
                        siTiktok: siTiktok,
                        siVk: siVk,
                      }
                      const iconData = iconMap[social.icon]
                      return (
                        <a
                          key={index}
                          className="contact-social-btn"
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.name}
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d={iconData?.path} />
                          </svg>
                        </a>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка: адрес + карта */}
          <div className="contacts-info-right">
            <div className="contact-item">
              <div className="contact-info-icon">
                <MapPin size={18} />
              </div>
              <div className="contact-info-content">
                <div className="contact-info-label">Адрес</div>
                <div className="contact-info-value">
                  <div>{contactsData.address}</div>
                  {contactsData.addressDetails && (
                    <div style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>
                      {contactsData.addressDetails}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Карта */}
            <div className="card">
              <iframe
                className="map-frame"
                title="Карта — Лицедей"
                src={contactsData.mapUrl}
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Форма обратной связи */}
      <div className="content-card">
        <div className="readable-content">
          <h2>Обратная связь</h2>
        </div>
        <div className="yandex-form-container">
          {formError ? (
            <div className="form-fallback">
              <p>Форма обратной связи временно недоступна. Вы можете связаться с нами:</p>
              <div className="contact-methods">
                <p>
                  <strong>Телефон:</strong>{' '}
                  {contactsData.phones.map(phone => phone.number).join(', ')}
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  <a href={contactsData.email.href}>{contactsData.email.text}</a>
                </p>
                <p>
                  <strong>Telegram:</strong>{' '}
                  <a
                    href={contactsData.socials.find(s => s.name === 'Telegram')?.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @licedeycentre
                  </a>
                </p>
              </div>
              <button onClick={() => setFormError(false)} className="retry-button">
                Попробовать снова
              </button>
            </div>
          ) : (
            <iframe
              src={contactsData.feedbackFormUrl}
              frameBorder="0"
              name="ya-form-68e8929a02848f207c913644"
              width="100%"
              height="500"
              title="Форма обратной связи"
              className="yandex-form-iframe"
              onError={() => {
                console.warn('Ошибка загрузки формы обратной связи')
                setFormError(true)
              }}
              onLoad={() => {
                console.log('Форма обратной связи загружена')
                setFormError(false)
              }}
            />
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default ContactsPage
