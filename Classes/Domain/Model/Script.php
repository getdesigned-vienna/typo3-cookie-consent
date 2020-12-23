<?php


namespace GD\Cookieconsent\Domain\Model;


use TYPO3\CMS\Extbase\DomainObject\AbstractEntity;

class Script extends AbstractEntity
{

    /**
     * @var string
     */
    protected $name;

    /**
     * @var string
     */
    protected $description;

    /**
     * @var string
     */
    protected $script;

    /**
     * @var Cookiecategory
     */
    protected $cookiecategory;

    /**
     * @var \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\GD\Cookieconsent\Domain\Model\Cookie>
     */
    protected $cookies;

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * @param string $description
     */
    public function setDescription(string $description): void
    {
        $this->description = $description;
    }

    /**
     * @return string
     */
    public function getScript(): string
    {
        return $this->script;
    }

    /**
     * @param string $script
     */
    public function setScript(string $script): void
    {
        $this->script = $script;
    }

    /**
     * @return Cookiecategory
     */
    public function getCookiecategory(): Cookiecategory
    {
        return $this->cookiecategory;
    }

    /**
     * @param Cookiecategory $cookiecategory
     */
    public function setCookiecategory(Cookiecategory $cookiecategory): void
    {
        $this->cookiecategory = $cookiecategory;
    }

    /**
     * @return \TYPO3\CMS\Extbase\Persistence\ObjectStorage
     */
    public function getCookies(): \TYPO3\CMS\Extbase\Persistence\ObjectStorage
    {
        return $this->cookies;
    }

    /**
     * @param \TYPO3\CMS\Extbase\Persistence\ObjectStorage $cookies
     */
    public function setCookies(\TYPO3\CMS\Extbase\Persistence\ObjectStorage $cookies): void
    {
        $this->cookies = $cookies;
    }

}