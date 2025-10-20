import React from 'react'
import { useContacts, useFAQ } from '../hooks/useContent'
import PageLayout from '../components/PageLayout'
import { MapPin, Phone, Mail, Users } from 'lucide-react'
import { siTelegram, siTiktok, siVk } from 'simple-icons'
import { FAQAccordion } from '../components/FAQAccordion'

const ContactsPage: React.FC = () => {
  const contactsData = useContacts()
  const faqData = useFAQ()

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
                        <a
                          href={`https://wa.me/${phone.href.replace('tel:', '').replace(/[^\d]/g, '')}`}
                          className="whatsapp-btn"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Написать в WhatsApp"
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                          </svg>
                          WhatsApp
                        </a>
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
          <iframe
            src={contactsData.feedbackFormUrl}
            frameBorder="0"
            name="ya-form-68e8929a02848f207c913644"
            width="100%"
            height="500"
            title="Форма обратной связи"
            className="yandex-form-iframe"
          />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="content-card">
        <div className="readable-content">
          <h2>Часто задаваемые вопросы</h2>
        </div>
        <FAQAccordion items={faqData.faq} />
      </div>
    </PageLayout>
  )
}

export default ContactsPage
